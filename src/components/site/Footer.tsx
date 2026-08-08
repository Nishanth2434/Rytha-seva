import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="KrishiMitra AI" className="h-9 w-9 object-contain" />
            <span className="text-base font-bold">KrishiMitra AI</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {t(
              "hero_desc",
              "An AI companion for Indian farmers — hyperlocal weather advice, pest prediction, live mandi intelligence and shared farm equipment.",
            )}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">{t("nav_home", "Explore")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/weather" className="hover:text-primary">
                {t("nav_weather", "Weather Advisor")}
              </Link>
            </li>
            <li>
              <Link to="/pest" className="hover:text-primary">
                {t("nav_pest", "Pest Prediction")}
              </Link>
            </li>
            <li>
              <Link to="/market" className="hover:text-primary">
                {t("nav_market", "Market Intelligence")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">{t("nav_equipment", "Community")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/equipment" className="hover:text-primary">
                {t("nav_equipment", "Equipment Booking")}
              </Link>
            </li>
            <li>
              <Link to="/reels" className="hover:text-primary">
                {t("nav_reels", "Agri Reels")}
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary">
                {t("nav_signin", "Sign in")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} KrishiMitra AI. Grown with care for Indian farms.
      </div>
    </footer>
  );
}
