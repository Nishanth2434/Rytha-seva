import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { apiRequest } from "@/lib/api-client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await apiRequest("/auth/me/");
    if (error || !data) throw redirect({ to: "/login" });
    return { user: data };
  },
  component: () => <Outlet />,
});