import { useEffect, useState } from "react";
import { apiRequest, getAuthToken, clearAuthTokens } from "@/lib/api-client";

export type AppRole = "admin" | "owner" | "farmer";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  village?: string;
  state?: string;
  district?: string;
  avatar_url?: string;
  is_owner: boolean;
  is_admin: boolean;
  owner_status: "none" | "pending" | "approved" | "rejected";
}

/** Returns the redirect path for a given role after login. */
export function getRedirectPath(role: AppRole | null): string {
  switch (role) {
    case "owner":
      return "/owner/dashboard";
    case "admin":
    case "farmer":
    default:
      return "/";
  }
}

export function useAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = getAuthToken();
    if (!token) {
      setProfile(null);
      setRole(null);
      setLoading(false);
      return;
    }

    const { data, error } = await apiRequest<UserProfile>("/auth/me/");
    if (error || !data) {
      clearAuthTokens();
      setProfile(null);
      setRole(null);
    } else {
      setProfile(data);
      if (data.is_admin) {
        setRole("admin");
      } else if (data.is_owner) {
        setRole("owner");
      } else {
        setRole("farmer");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // Listen for custom auth-state-changed events
    const handleAuthChange = () => {
      fetchProfile();
    };
    window.addEventListener("auth-state-changed", handleAuthChange);
    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
    };
  }, []);

  const logout = () => {
    clearAuthTokens();
    setProfile(null);
    setRole(null);
    window.dispatchEvent(new Event("auth-state-changed"));
  };

  return {
    user: profile,
    profile,
    role,
    loading,
    logout,
    refreshProfile: fetchProfile,
  };
}