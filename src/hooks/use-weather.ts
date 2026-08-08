import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchOpenMeteoWeather,
  searchOpenMeteoLocations,
  reverseGeocode,
  fetchIpLocation,
  ProcessedWeatherData,
  GeocodingResult,
} from "@/lib/open-meteo";

const STORAGE_KEY = "krishimitra_stable_location";

const DEFAULT_LAT = 20.5937;
const DEFAULT_LON = 78.9629;
const DEFAULT_NAME = "";

export interface LocationState {
  lat: number;
  lon: number;
  name: string;
  accuracy?: number | undefined;
}

interface SavedLocationData extends LocationState {
  source: "gps" | "ip" | "manual" | "default";
}

function getInitialStoredLocation(): SavedLocationData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.lat === "number" && typeof parsed.lon === "number") {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load stored location:", e);
  }
  return null;
}

function saveStoredLocation(data: SavedLocationData) {
  if (typeof window === "undefined") return;
  try {
    const str = JSON.stringify(data);
    sessionStorage.setItem(STORAGE_KEY, str);
    localStorage.setItem(STORAGE_KEY, str);
  } catch (e) {
    console.warn("Failed to save location:", e);
  }
}

export function useWeather(initialLocation?: Partial<LocationState>) {
  const stored = getInitialStoredLocation();

  const [location, setLocationState] = useState<LocationState>({
    lat: initialLocation?.lat ?? stored?.lat ?? DEFAULT_LAT,
    lon: initialLocation?.lon ?? stored?.lon ?? DEFAULT_LON,
    name: initialLocation?.name ?? stored?.name ?? DEFAULT_NAME,
    accuracy: initialLocation?.accuracy ?? stored?.accuracy,
  });

  const [locationSource, setLocationSourceState] = useState<"gps" | "ip" | "manual" | "default">(
    stored?.source || (initialLocation?.lat ? "manual" : "default"),
  );

  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locatingStatus, setLocatingStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Search state
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const initialLocateAttempted = useRef(false);

  // Update location and persist to storage
  const setLocation = useCallback(
    (
      newLoc: LocationState | ((prev: LocationState) => LocationState),
      source: "gps" | "ip" | "manual" | "default" = "manual",
    ) => {
      setLocationState((prev) => {
        const next = typeof newLoc === "function" ? newLoc(prev) : newLoc;
        saveStoredLocation({ ...next, source });
        return next;
      });
      setLocationSourceState(source);
    },
    [],
  );

  // Fetch Open-Meteo weather when coordinates change.
  const refreshWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOpenMeteoWeather(
        location.lat,
        location.lon,
        location.name,
      );
      setWeatherData(data);
      if (data.locationName && (!location.name || location.name.includes("°"))) {
        setLocationState((prev) => {
          const updated = { ...prev, name: data.locationName };
          saveStoredLocation({ ...updated, source: locationSource });
          return updated;
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load weather data.";
      console.error("Failed to fetch weather from Open-Meteo:", err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.lat, location.lon]);

  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  /**
   * Stable One-Shot Location Fix:
   * Obtains a high-precision satellite/network lock ONCE on site entry or user request,
   * then locks it into state & storage so scrolling/rendering never causes fluctuation.
   */
  const locateUser = useCallback(async () => {
    setIsLocating(true);
    setLocatingStatus("Locating high-precision GPS coordinates...");
    setGeoError(null);

    const tryIpLocationFallback = async (reason?: string) => {
      try {
        const ipLoc = await fetchIpLocation();
        if (ipLoc) {
          const newLoc = {
            lat: ipLoc.lat,
            lon: ipLoc.lon,
            name: ipLoc.name,
            accuracy: undefined,
          };
          setLocation(newLoc, "ip");
          setGeoError(null);
          return true;
        }
      } catch (err) {
        console.warn("IP location fallback failed:", err);
      }

      if (reason) setGeoError(reason);
      setLocationSourceState("default");
      return false;
    };

    if (!navigator.geolocation) {
      await tryIpLocationFallback("Browser GPS not supported. Used Network Location.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        try {
          const revName = await reverseGeocode(lat, lon);
          const finalName = revName || `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
          setLocation({ lat, lon, name: finalName, accuracy }, "gps");
          setGeoError(null);
        } catch {
          setLocation(
            { lat, lon, name: `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`, accuracy },
            "gps",
          );
        } finally {
          setIsLocating(false);
        }
      },
      async (err) => {
        console.warn("GPS lock notice:", err.message);
        let errorReason = "GPS access unavailable. Used Network Location.";
        if (err.code === err.PERMISSION_DENIED) {
          errorReason = "GPS permission denied in browser settings. Used Network Location.";
        }
        await tryIpLocationFallback(errorReason);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 4000, // Fast 4-second maximum hardware GPS wait before IP location fallback
        maximumAge: 300000, // 5-minute cache reuse for instant sub-second response
      },
    );
  }, [setLocation]);

  // Auto-trigger location lookup ONLY ONCE if no location was saved in storage
  useEffect(() => {
    if (!initialLocateAttempted.current) {
      initialLocateAttempted.current = true;
      if (!stored || stored.source === "default") {
        locateUser();
      }
    }
  }, [locateUser, stored]);

  // Search for village / town / city by name using Open-Meteo Geocoding
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchOpenMeteoLocations(query);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Set explicit custom pinpoint coordinates
  const setExactCustomCoords = useCallback(
    (lat: number, lon: number, customName?: string) => {
      const newLoc = {
        lat,
        lon,
        name: customName || `${lat.toFixed(5)}°N, ${lon.toFixed(5)}°E`,
        accuracy: 0.1,
      };
      setLocation(newLoc, "manual");
      setGeoError(null);
    },
    [setLocation],
  );

  // Select a location from search results or presets
  const selectLocation = useCallback(
    (loc: { lat: number; lon: number; name: string }) => {
      setLocation({ ...loc, accuracy: undefined }, "manual");
      setSearchResults([]);
      setGeoError(null);
    },
    [setLocation],
  );

  return {
    location,
    weatherData,
    isLoading,
    isLocating,
    locatingStatus,
    error,
    geoError,
    locationSource,
    searchResults,
    isSearching,
    refreshWeather,
    locateUser,
    setExactCustomCoords,
    searchLocation,
    selectLocation,
    setLocation: (loc: LocationState) => setLocation(loc, "manual"),
  };
}
