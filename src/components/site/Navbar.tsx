import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Menu, X, User as UserIcon, LogOut, Tractor, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage, languages, LanguageCode } from "@/context/language-context";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  async function signOut() {
    logout();
    navigate({ to: "/", replace: true });
  }

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const links = [
    { to: "/", label: t("nav_home", "Home") },
    { to: "/weather", label: t("nav_weather", "Weather") },
    { to: "/pest", label: t("nav_pest", "Pest AI") },
    { to: "/market", label: t("nav_market", "Market") },
    { to: "/equipment", label: t("nav_equipment", "Equipment") },
    { to: "/reels", label: t("nav_reels", "Reels") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="truncate text-lg font-bold">
            Krishi<span className="text-primary">Mitra</span> AI
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {l.label}
            </Link>
          ))}

          {/* 🌐 Multi-Language Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 rounded-full border-gray-200 gap-1.5 px-3"
              >
                <Globe className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-xs">{currentLangObj?.nativeName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-2xl p-1.5 shadow-xl">
              {languages.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLanguage(l.code as LanguageCode)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between ${
                    language === l.code ? "bg-green-50 text-green-700 font-bold" : "text-gray-700"
                  }`}
                >
                  <span>{l.nativeName}</span>
                  <span className="text-xs text-gray-400">{l.code.toUpperCase()}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              {role === "owner" && (
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/owner/dashboard">
                    <Tractor className="mr-1.5 h-4 w-4" />{" "}
                    {t("nav_owner_dashboard", "Owner Dashboard")}
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/profile">
                  <UserIcon className="mr-1.5 h-4 w-4" /> {t("nav_profile", "Profile")}
                </Link>
              </Button>
              <Button variant="ghost" className="rounded-full" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild className="ml-2 rounded-full shadow-soft">
              <Link to="/login">{t("nav_signin", "Sign in")}</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-200 gap-1 px-2.5"
              >
                <Globe className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-xs">{currentLangObj?.nativeName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-2xl p-1.5 shadow-xl">
              {languages.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLanguage(l.code as LanguageCode)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between ${
                    language === l.code ? "bg-green-50 text-green-700 font-bold" : "text-gray-700"
                  }`}
                >
                  <span>{l.nativeName}</span>
                  <span className="text-xs text-gray-400">{l.code.toUpperCase()}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                {role === "owner" && (
                  <Link
                    to="/owner/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium"
                  >
                    {t("nav_owner_dashboard", "Owner Dashboard")}
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium"
                >
                  {t("nav_profile", "Profile")}
                </Link>
                <Button variant="outline" className="mt-2 rounded-full" onClick={signOut}>
                  {t("nav_signout", "Sign out")}
                </Button>
              </>
            ) : (
              <Button asChild className="mt-2 rounded-full">
                <Link to="/login" onClick={() => setOpen(false)}>
                  {t("nav_signin", "Sign in")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
