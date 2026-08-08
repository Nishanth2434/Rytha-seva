// Django API Client for KrishiMitra AI Frontend

const env = import.meta.env as Record<string, string | undefined>;
const API_BASE_URL = env.VITE_DJANGO_API_URL || "http://localhost:8000/api";

export const getAuthToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

export const setAuthTokens = (access: string, refresh: string) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${getAuthToken()}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });
        if (!retryResponse.ok) {
          const errData = (await retryResponse.json().catch(() => ({}))) as Record<string, string>;
          return {
            data: null,
            error: errData.detail || errData.error || `HTTP ${retryResponse.status}`,
          };
        }
        const data = (await retryResponse.json()) as T;
        return { data, error: null };
      } else {
        clearAuthTokens();
        return { data: null, error: "Session expired. Please log in again." };
      }
    }

    if (!response.ok) {
      const errData = (await response.json().catch(() => ({}))) as Record<string, string>;
      return {
        data: null,
        error: errData.detail || errData.error || JSON.stringify(errData) || `HTTP ${response.status}`,
      };
    }

    if (response.status === 204) {
      return { data: null, error: null };
    }

    const data = (await response.json()) as T;
    return { data, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network error";
    return { data: null, error: errorMsg };
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (res.ok) {
      const data = (await res.json()) as { access: string; refresh?: string };
      localStorage.setItem("access_token", data.access);
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }
      return true;
    }
  } catch (e) {
    console.error("Failed to refresh token", e);
  }
  return false;
}
