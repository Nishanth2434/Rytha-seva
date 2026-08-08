import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CloudRain,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  CloudLightning,
  MapPin,
  RefreshCw,
  Info,
  Navigation,
  Compass,
  CloudSun,
  CloudFog,
  Snowflake,
  LocateFixed,
  Calendar,
  Crosshair,
  Target,
  SlidersHorizontal,
  Edit3,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageShell } from "@/components/site/PageShell";
import { AdBanner } from "@/components/site/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useWeather } from "@/hooks/use-weather";
import { generateFarmingRecommendations, ForecastDay } from "@/lib/open-meteo";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "7-Day High Precision Weather & Crop Report | KrishiMitra AI" },
      {
        name: "description",
        content:
          "Satellite GPS precision location lock & Open-Meteo 7-day weather report and AI crop advisories.",
      },
      { property: "og:title", content: "Pinpoint Precision Weather | KrishiMitra AI" },
      {
        property: "og:description",
        content: "Exact GPS Satellite Location detection & 7-day Open-Meteo weather report.",
      },
    ],
  }),
  component: WeatherPage,
});

const availableCrops = [
  "wheat",
  "paddy",
  "cotton",
  "sugarcane",
  "maize",
  "mustard",
  "tomato",
  "grape",
  "onion",
  "potato",
];

const growthStages = ["sowing", "vegetative", "flowering", "fruiting", "harvest"];

function WeatherPage() {
  const {
    location,
    weatherData,
    isLoading,
    isLocating,
    locatingStatus,
    error,
    geoError,
    locationSource,
    refreshWeather,
    locateUser,
    setExactCustomCoords,
  } = useWeather();

  const [crop, setCrop] = useState("wheat");
  const [stage, setStage] = useState("vegetative");

  // Custom manual coordinate input state
  const [showCustomCoordsForm, setShowCustomCoordsForm] = useState(false);
  const [customLatInput, setCustomLatInput] = useState("");
  const [customLonInput, setCustomLonInput] = useState("");

  function handleCustomCoordsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lat = parseFloat(customLatInput);
    const lon = parseFloat(customLonInput);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      setExactCustomCoords(lat, lon, `Pinpoint Coords (${lat.toFixed(4)}°, ${lon.toFixed(4)}°)`);
      setShowCustomCoordsForm(false);
    }
  }

  // Dynamic AI farming recommendations generated strictly from real 7-day Open-Meteo weather data
  const aiRecommendations = useMemo(() => {
    if (!weatherData) return [];
    return generateFarmingRecommendations(weatherData, crop, stage);
  }, [weatherData, crop, stage]);

  // Weather condition icon renderer
  function renderWeatherIcon(
    group: ForecastDay["conditionGroup"],
    className = "h-8 w-8"
  ) {
    switch (group) {
      case "sun":
        return <Sun className={`${className} text-amber-400`} />;
      case "cloud":
        return <CloudSun className={`${className} text-slate-400`} />;
      case "rain":
        return <CloudRain className={`${className} text-blue-500`} />;
      case "lightning":
        return <CloudLightning className={`${className} text-amber-500 animate-pulse`} />;
      case "fog":
        return <CloudFog className={`${className} text-slate-400`} />;
      case "snow":
        return <Snowflake className={`${className} text-sky-300`} />;
      default:
        return <Sun className={`${className} text-amber-400`} />;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageShell
        eyebrow="Open-Meteo Precision Weather"
        title="High-Accuracy Weather & Crop Report"
        description="Continuous hardware satellite GPS location refinement to fetch live Open-Meteo 7-day weather forecasts & AI farming advisories for your exact land."
      >
        {/* ─── Hero Locate Me & High Accuracy Location Panel ─── */}
        <div className="mb-8 rounded-3xl border border-green-100 bg-gradient-to-r from-green-50/80 via-emerald-50/50 to-white p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-medium text-xs px-2.5 py-0.5 border-0">
                  <LocateFixed className="mr-1 h-3 w-3" /> Open-Meteo API Active
                </Badge>

                {locationSource === "gps" && (
                  <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50 text-xs font-semibold">
                    <Crosshair className="mr-1 h-3 w-3 text-emerald-600" />
                    {location.accuracy && location.accuracy < 50
                      ? `Pinpoint GPS (±${location.accuracy}m)`
                      : `GPS Fix (±${location.accuracy || "broad"}m)`}
                  </Badge>
                )}

                {locationSource === "ip" && (
                  <Badge variant="outline" className="border-blue-400 text-blue-700 bg-blue-50 text-xs">
                    Network Location API
                  </Badge>
                )}

                {locationSource === "manual" && (
                  <Badge variant="outline" className="border-purple-400 text-purple-700 bg-purple-50 text-xs font-semibold">
                    Custom Pinpoint Coordinates
                  </Badge>
                )}
              </div>

              <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 flex items-start sm:items-center gap-2 tracking-tight min-w-0 break-words leading-snug">
                <MapPin className="h-7 w-7 text-green-600 shrink-0 mt-0.5 sm:mt-0" />
                <span className="min-w-0 break-words">{location.name || "Detecting Exact Location..."}</span>
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1 font-mono">
                  <Compass className="h-3.5 w-3.5 text-green-600" />
                  Lat: <strong className="text-gray-900">{location.lat.toFixed(6)}° N</strong>
                </span>
                <span>•</span>
                <span className="font-mono">
                  Lon: <strong className="text-gray-900">{location.lon.toFixed(6)}° E</strong>
                </span>
                {location.accuracy !== undefined && location.accuracy > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Target className="h-3.5 w-3.5" /> GPS Radius: ±{location.accuracy} meters
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={locateUser}
                disabled={isLocating || isLoading}
                className="h-14 rounded-2xl bg-emerald-600 px-7 font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all text-base relative overflow-hidden"
              >
                {isLocating ? (
                  <>
                    <RefreshCw className="mr-2.5 h-5 w-5 animate-spin" /> Satellite Lock...
                  </>
                ) : (
                  <>
                    <Navigation className="mr-2.5 h-5 w-5 fill-current" /> Locate Me (Refine GPS)
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setShowCustomCoordsForm(!showCustomCoordsForm)}
                variant="outline"
                className="h-14 rounded-2xl border-gray-200 bg-white px-4 font-semibold text-gray-700 hover:bg-gray-50 shadow-sm text-xs"
              >
                <Edit3 className="mr-2 h-4 w-4 text-green-600" /> Enter Custom Lat/Lon
              </Button>

              <Button
                type="button"
                onClick={refreshWeather}
                disabled={isLoading}
                variant="outline"
                className="h-14 w-14 rounded-2xl border-gray-200 bg-white p-0 hover:bg-gray-50 shadow-sm"
                title="Refresh Weather Data"
              >
                <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Satellite locking live status notification banner */}
          {isLocating && locatingStatus && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900 animate-pulse">
              <Crosshair className="h-4 w-4 shrink-0 text-emerald-600 animate-spin" />
              <span className="font-semibold">{locatingStatus}</span>
            </div>
          )}

          {/* Manual Pinpoint Latitude & Longitude Entry Form */}
          {showCustomCoordsForm && (
            <form onSubmit={handleCustomCoordsSubmit} className="mt-4 p-4 rounded-2xl border border-green-200 bg-white shadow-inner flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">Latitude (e.g. 19.997523)</Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="e.g. 19.997523"
                  value={customLatInput}
                  onChange={(e) => setCustomLatInput(e.target.value)}
                  className="h-10 w-44 rounded-xl text-xs font-mono"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-700">Longitude (e.g. 73.789841)</Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="e.g. 73.789841"
                  value={customLonInput}
                  onChange={(e) => setCustomLonInput(e.target.value)}
                  className="h-10 w-44 rounded-xl text-xs font-mono"
                  required
                />
              </div>
              <Button type="submit" className="h-10 rounded-xl bg-green-600 px-5 text-xs font-bold text-white hover:bg-green-700">
                Set Exact Pinpoint
              </Button>
            </form>
          )}

          {/* Location info notice */}
          {geoError && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <Info className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{geoError}</span>
            </div>
          )}

          {/* Crop & Growth Stage Selectors */}
          <div className="mt-6 pt-5 border-t border-green-100 flex flex-col sm:flex-row items-center gap-4">
            <span className="text-xs font-semibold text-gray-600 shrink-0">Customize Advisories:</span>
            
            <div className="w-full sm:w-48 space-y-1">
              <Label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Crop</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-white text-xs shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCrops.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize text-xs">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48 space-y-1">
              <Label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Growth Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-white text-xs shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {growthStages.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ─── Error State ─── */}
        {error && (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
            <h3 className="mt-2 text-lg font-bold text-red-800">Weather API Connection Error</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <Button
              onClick={refreshWeather}
              className="mt-4 rounded-xl bg-red-600 px-5 text-white hover:bg-red-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Retry Open-Meteo Request
            </Button>
          </div>
        )}

        {/* ─── Loading Skeletons ─── */}
        {isLoading && !weatherData && (
          <div className="mb-10 animate-pulse">
            <div className="h-60 w-full rounded-3xl bg-emerald-100/50" />
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-48 rounded-3xl bg-gray-100" />
              ))}
            </div>
          </div>
        )}

        {/* ─── Main Weather Report & 7-Day Forecast ─── */}
        {weatherData && (
          <>
            {/* Current Weather Card */}
            <div className="mb-10">
              <Card className="overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white shadow-xl shadow-green-100">
                <CardContent className="p-8">
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="border-0 bg-white/20 text-white backdrop-blur-md">
                          Open-Meteo Live Report
                        </Badge>
                        <span className="text-xs text-green-100">Fetched at {weatherData.fetchedAt}</span>
                      </div>

                      <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                        {weatherData.locationName || location.name}
                      </h3>

                      <p className="mt-2 text-base font-medium text-green-50 flex items-center gap-2">
                        {renderWeatherIcon(weatherData.current.conditionGroup, "h-5 w-5")}
                        {weatherData.current.conditionLabel}
                      </p>

                      <div className="mt-5 flex items-baseline gap-4">
                        <span className="text-6xl font-extrabold tracking-tight">
                          {weatherData.current.temp}°C
                        </span>
                        <span className="text-lg text-green-100">
                          Feels like {weatherData.current.feelsLike}°C
                        </span>
                      </div>
                    </div>

                    {/* 4 Weather Metrics */}
                    <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-md sm:grid-cols-4 md:w-auto">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 text-white">
                          <Thermometer className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-100">Temperature</p>
                          <p className="text-lg font-bold">{weatherData.current.temp}°C</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 text-white">
                          <Droplets className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-100">Humidity</p>
                          <p className="text-lg font-bold">{weatherData.current.humidity}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 text-white">
                          <Wind className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-100">Wind Speed</p>
                          <p className="text-lg font-bold">{weatherData.current.windSpeed} km/h</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 text-white">
                          <CloudRain className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-100">Rainfall</p>
                          <p className="text-lg font-bold">
                            {weatherData.current.precipitation} mm
                            <span className="ml-1 text-xs text-green-100 font-normal">
                              ({weatherData.current.rainChance}%)
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ─── 7-DAY FORECAST REPORT SECTION ─── */}
            <div className="mb-12">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-100 text-green-700">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">7-Day Weather Forecast Report</h3>
                    <p className="text-xs text-gray-500">
                      Open-Meteo daily prediction for {location.name}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                  7 Days Complete Data
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                {weatherData.forecast.map((d, i) => (
                  <Card
                    key={i}
                    className={`rounded-3xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-md ${
                      i === 0 ? "ring-2 ring-green-500/30 bg-green-50/30" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {d.day}
                      </p>
                      <p className="text-[10px] text-gray-400">{d.date}</p>

                      <div className="my-3 grid place-items-center">
                        {renderWeatherIcon(d.conditionGroup, "h-8 w-8")}
                      </div>

                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        {d.conditionLabel}
                      </p>

                      <p className="text-xl font-bold text-gray-900">
                        {d.tempMax}°<span className="text-xs text-gray-400 font-normal"> / {d.tempMin}°C</span>
                      </p>

                      <p className="mt-1 text-xs font-medium text-blue-600">
                        🌧️ {d.rainSum}mm ({d.rainProbability}%)
                      </p>

                      <div className="mt-2 flex justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-50">
                        <span>💧 {d.humidityMax}%</span>
                        <span>💨 {d.windSpeedMax}k/h</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* ─── 7-Day AI Farming Recommendations Section ─── */}
            <div className="mb-12">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-100 text-green-700">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      7-Day Agricultural Action Plan
                    </h3>
                    <p className="text-xs text-gray-500">
                      AI crop advice for <span className="font-semibold text-green-700 capitalize">{crop}</span> ({stage} stage) based on the 7-day forecast
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {aiRecommendations.map((item, idx) => (
                  <Card
                    key={idx}
                    className={`overflow-hidden rounded-3xl border transition-all duration-300 hover:shadow-lg ${
                      item.type === "danger"
                        ? "border-red-200 bg-gradient-to-br from-red-50/60 to-white hover:border-red-300"
                        : item.type === "warning"
                          ? "border-amber-200 bg-gradient-to-br from-amber-50/60 to-white hover:border-amber-300"
                          : item.type === "success"
                            ? "border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white hover:border-emerald-300"
                            : "border-blue-200 bg-gradient-to-br from-blue-50/60 to-white hover:border-blue-300"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                            item.type === "danger"
                              ? "bg-red-100 text-red-600"
                              : item.type === "warning"
                                ? "bg-amber-100 text-amber-600"
                                : item.type === "success"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {item.type === "danger" ? (
                            <AlertTriangle className="h-6 w-6" />
                          ) : item.type === "warning" ? (
                            <CloudRain className="h-6 w-6" />
                          ) : item.type === "success" ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            <Info className="h-6 w-6" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-semibold uppercase tracking-wider ${
                                item.type === "danger"
                                  ? "text-red-600"
                                  : item.type === "warning"
                                    ? "text-amber-600"
                                    : item.type === "success"
                                      ? "text-emerald-600"
                                      : "text-blue-600"
                              }`}
                            >
                              {item.badge}
                            </span>
                          </div>

                          <h4 className="mt-1 text-base font-bold text-gray-900">{item.title}</h4>
                          <p className="mt-0.5 text-sm font-semibold text-gray-800">
                            💡 Action: {item.action}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mb-10 rounded-2xl border border-green-100 bg-green-50/60 p-5 text-xs text-gray-600">
          <div className="mb-1 flex items-center gap-2 font-semibold text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" /> Pinpoint Precision Open-Meteo Integration
          </div>
          Using exact coordinates ({location.lat.toFixed(5)}°N, {location.lon.toFixed(5)}°E) to query Open-Meteo without an API key.
        </div>

        <AdBanner />
      </PageShell>

      <Footer />
    </div>
  );
}
