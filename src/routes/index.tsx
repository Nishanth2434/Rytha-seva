import { createFileRoute, Link } from "@tanstack/react-router";
import { SchemeUrlVerifier } from "@/components/site/SchemeUrlVerifier";
import { useRef } from "react";
import {
  CloudSun,
  Bug,
  TrendingUp,
  Mic,
  Tractor,
  ArrowRight,
  Sparkles,
  Leaf,
  ChevronRight,
  ChevronLeft,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  Play,
  Eye,
  MapPin,
  Landmark,
  FileText,
  IndianRupee,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AdBanner } from "@/components/site/AdBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { useWeather } from "@/hooks/use-weather";

// Real-world Unsplash photographs (free commercial use, no attribution required)
const heroImage =
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80";
const weatherImg =
  "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80";
const pestImg =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80";
const marketImg =
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80";
const voiceImg =
  "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80";
const equipmentImg =
  "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KrishiMitra AI — Smart Farming Companion for Indian Farmers" },
      {
        name: "description",
        content:
          "AI-powered farming assistant — hyperlocal weather advice, pest prediction, live mandi prices, voice assistant and equipment booking.",
      },
      { property: "og:title", content: "KrishiMitra AI — Smart Farming Companion" },
      {
        property: "og:description",
        content:
          "Weather advisories, pest prediction, mandi intelligence, voice AI and equipment rental in one app.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "11.8 Cr", label: "PM-KISAN Beneficiaries" },
  { value: "7,000+", label: "APMC Mandis" },
  { value: "28", label: "States Covered" },
  { value: "Agmarknet", label: "Data Source" },
];

function Index() {
  const { t } = useLanguage();
  const { location, weatherData, isLoading, isLocating, locationSource } = useWeather();
  const cur = locationSource === "default" ? undefined : weatherData?.current;
  const featureScrollRef = useRef<HTMLDivElement>(null);

  function scrollFeatures(direction: "left" | "right") {
    if (featureScrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      featureScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  const featuresList = [
    {
      to: "/weather",
      icon: CloudSun,
      image: weatherImg,
      title: t("feat_weather_title", "Weather Advisor"),
      text: t(
        "feat_weather_desc",
        "Hyperlocal 7-day forecasts turned into spray, irrigation and harvest decisions.",
      ),
      color: "from-sky-50 to-blue-50 border-sky-100",
      iconBg: "bg-sky-100 text-sky-600",
    },
    {
      to: "/pest",
      icon: Bug,
      image: pestImg,
      title: t("feat_pest_title", "Pest Alerts"),
      text: t(
        "feat_pest_desc",
        "AI-powered outbreak risk scores 10 days ahead tuned to your village and crop.",
      ),
      color: "from-amber-50 to-yellow-50 border-amber-100",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      to: "/market",
      icon: TrendingUp,
      image: marketImg,
      title: t("feat_market_title", "Market Analysis"),
      text: t(
        "feat_market_desc",
        "Live mandi rates, 7-day price momentum and AI sell-or-hold recommendations.",
      ),
      color: "from-emerald-50 to-green-50 border-emerald-100",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      to: "/reels",
      icon: Mic,
      image: voiceImg,
      title: t("feat_voice_title", "Voice Assistant"),
      text: t(
        "feat_voice_desc",
        "Ask anything about your farm in your language — instant AI responses.",
      ),
      color: "from-violet-50 to-indigo-50 border-violet-100",
      iconBg: "bg-violet-100 text-violet-600",
    },
    {
      to: "/equipment",
      icon: Tractor,
      image: equipmentImg,
      title: t("feat_equipment_title", "Equipment Booking"),
      text: t(
        "feat_equipment_desc",
        "Rent tractors, harvesters, drones and sprayers from verified owners near you.",
      ),
      color: "from-orange-50 to-red-50 border-orange-100",
      iconBg: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="space-y-16 pb-16">
        {/* ─── 1. HERO SECTION ─── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-green-50/30 to-white pt-10 pb-16">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-green-100/40 to-transparent" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-sky-100/30 to-transparent" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
                <Sparkles className="h-4 w-4" />
                {t("hero_eyebrow", "AI-Powered Farming")}
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {t("hero_title", "AI Powered Farming Assistant")}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
                {t(
                  "hero_desc",
                  "Helping farmers make smarter decisions through weather intelligence, pest prediction, market insights and equipment booking.",
                )}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-green-600 px-8 shadow-lg shadow-green-200 transition-all hover:bg-green-700"
                >
                  <Link to="/weather">
                    {t("hero_explore_weather", "Explore Weather")}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-gray-200 px-8 text-gray-700 hover:bg-gray-50"
                >
                  <Link to="/equipment">{t("hero_book_equipment", "Book Equipment")}</Link>
                </Button>
              </div>

              <div className="mt-12 grid max-w-lg grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-up lg:animate-none">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-50 to-emerald-50 p-2 shadow-2xl shadow-green-100/50 border border-green-100">
                <img
                  src={heroImage}
                  alt="AI-powered smart farming illustration"
                  width={800}
                  height={600}
                  className="h-full w-full rounded-[2rem] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-6 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-xl">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 text-green-600 font-bold">
                  <Leaf className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Rain in 36 hours</p>
                  <p className="text-xs text-gray-400">Hold spray — save ₹3,400</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5 FEATURE CARDS (LEFT-TO-RIGHT HORIZONTAL CAROUSEL STREAM) ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-600">
                {t("features_eyebrow", "Smart Tools")}
              </p>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {t("features_title", "Explore Features (Swipe Left to Right)")}
              </h2>
            </div>

            {/* Left / Right Scroll Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollFeatures("left")}
                className="h-9 w-9 rounded-full border-gray-200 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollFeatures("right")}
                className="h-9 w-9 rounded-full border-gray-200 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          </div>

          {/* Left-to-Right Horizontal Row Container */}
          <div
            ref={featureScrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-2 no-scrollbar"
            style={{ scrollbarWidth: "none" }}
          >
            {featuresList.map((f) => (
              <Link
                key={f.to}
                to={f.to}
                className={`group relative shrink-0 w-[280px] sm:w-[320px] snap-start flex flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-br ${f.color} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div>
                  <div className="relative overflow-hidden rounded-2xl bg-white/70 p-4 mb-4">
                    <img
                      src={f.image}
                      alt={f.title}
                      className="h-36 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${f.iconBg}`}>
                      <f.icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-gray-600">{f.text}</p>
                </div>

                <div className="mt-6 flex items-center text-xs font-bold text-green-600 group-hover:text-green-700">
                  {t("open_tool", "Open")} {f.title}{" "}
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── 2. WEATHER CARD ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {t("feat_weather_title", "Weather Advisor")}
              </h2>
            </div>
            <Link
              to="/weather"
              className="flex items-center text-xs font-semibold text-green-600 hover:underline"
            >
              Full Forecast <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <Card className="overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-200" />
                    <span className="text-2xl font-bold text-white">
                      {location.name ||
                        (isLocating ? "Detecting your location…" : "Location unavailable")}
                    </span>
                    <Badge className="bg-white/20 text-white border-0">
                      {isLocating ? "Locating…" : "Live · Your current location"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-green-100">
                    {cur?.conditionLabel ?? (isLoading ? "Loading live weather…" : "—")}
                  </p>
                  <div className="mt-4 flex items-baseline gap-4">
                    <span className="text-5xl font-extrabold">
                      {cur ? `${Math.round(cur.temp)}°C` : "--°C"}
                    </span>
                    <span className="text-sm text-green-100">
                      {cur ? `Feels like ${Math.round(cur.feelsLike)}°C` : ""}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md sm:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-green-200" />
                    <div>
                      <p className="text-[10px] text-green-100">Temp</p>
                      <p className="text-sm font-bold">{cur ? `${Math.round(cur.temp)}°C` : "--"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-green-200" />
                    <div>
                      <p className="text-[10px] text-green-100">Humidity</p>
                      <p className="text-sm font-bold">{cur ? `${Math.round(cur.humidity)}%` : "--"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-green-200" />
                    <div>
                      <p className="text-[10px] text-green-100">Wind</p>
                      <p className="text-sm font-bold">{cur ? `${Math.round(cur.windSpeed)} km/h` : "--"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-green-200" />
                    <div>
                      <p className="text-[10px] text-green-100">Rain Prediction</p>
                      <p className="text-sm font-bold">{cur ? `${Math.round(cur.rainChance)}% Chance` : "--"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── 3. AI RECOMMENDATION ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Weather Recommendations</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-3xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <Badge className="bg-red-100 text-red-700 border-0 text-[10px] uppercase font-bold">
                    Critical Alert
                  </Badge>
                  <h3 className="mt-1 text-base font-bold text-gray-900">
                    Heavy rainfall expected tomorrow.
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-red-900">
                    💡 Action: Avoid fertilizer application today.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    High rain probability (85%+) will wash away applied nitrogen and phosphorus
                    fertilizer. Postpone application.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] uppercase font-bold">
                    Natural Irrigation
                  </Badge>
                  <h3 className="mt-1 text-base font-bold text-gray-900">
                    Natural Rainfall Coverage
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-900">
                    💡 Action: Turn off drip irrigation system.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    Expected 24mm precipitation will satisfy crop water demand for 48 hours. Save
                    electricity and water.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ─── 4. 📢 SPONSORED ADVERTISEMENT ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <AdBanner label="Sponsored · Featured Agri Offer" />
        </section>

        {/* ─── GOVERNMENT SCHEMES & SUBSIDIES (REAL DATA) ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {t("schemes_title", "Government Schemes & Subsidies")}
              </h2>
            </div>
            <a
              href="https://www.myscheme.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs font-semibold text-blue-600 hover:underline"
            >
              myScheme Portal <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>

          <div className="mb-4">
            <SchemeUrlVerifier />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* PM-KISAN */}
            <Card className="rounded-3xl border border-blue-200 bg-blue-50/40 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                  <IndianRupee className="h-5 w-5" />
                </span>
                <div>
                  <Badge className="bg-blue-100 text-blue-800 border-0 text-[10px] uppercase font-bold">
                    {t("scheme_active", "Active Scheme")}
                  </Badge>
                  <h3 className="mt-1 text-base font-bold text-gray-900">
                    {t("scheme_pmkisan_title", "PM-KISAN Samman Nidhi")}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-blue-900">
                    {t("scheme_pmkisan_benefit", "₹6,000/year — 3 installments of ₹2,000 via DBT")}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    {t(
                      "scheme_pmkisan_desc",
                      "Income support for all landholding farmer families. Direct bank transfer every 4 months. Check status at pmkisan.gov.in",
                    )}
                  </p>
                  <a
                    href="https://pmkisan.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-xs font-bold text-blue-600 hover:underline"
                  >
                    pmkisan.gov.in <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </Card>

            {/* PMFBY - Fasal Bima */}
            <Card className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px] uppercase font-bold">
                    {t("scheme_active", "Active Scheme")}
                  </Badge>
                  <h3 className="mt-1 text-base font-bold text-gray-900">
                    {t("scheme_pmfby_title", "PM Fasal Bima Yojana (PMFBY)")}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-900">
                    {t(
                      "scheme_pmfby_benefit",
                      "Crop Insurance: 2% Kharif, 1.5% Rabi, 5% Commercial",
                    )}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    {t(
                      "scheme_pmfby_desc",
                      "Comprehensive crop insurance from pre-sowing to post-harvest. Budget: ₹69,515 Cr. Uses satellite & drone assessments for faster claims.",
                    )}
                  </p>
                  <a
                    href="https://pmfby.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-xs font-bold text-emerald-600 hover:underline"
                  >
                    pmfby.gov.in <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </Card>

            {/* SMAM */}
            <Card className="rounded-3xl border border-orange-200 bg-orange-50/40 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                  <Tractor className="h-5 w-5" />
                </span>
                <div>
                  <Badge className="bg-orange-100 text-orange-800 border-0 text-[10px] uppercase font-bold">
                    {t("scheme_subsidy", "Subsidy Scheme")}
                  </Badge>
                  <h3 className="mt-1 text-base font-bold text-gray-900">
                    {t("scheme_smam_title", "SMAM — Agri Mechanization")}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-orange-900">
                    {t(
                      "scheme_smam_benefit",
                      "40-50% subsidy on tractors, drones, tillers & sprayers",
                    )}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    {t(
                      "scheme_smam_desc",
                      "Sub-Mission on Agricultural Mechanization. 50% for SC/ST/small/marginal/women farmers, 40% for others. Supports Custom Hiring Centres.",
                    )}
                  </p>
                </div>
              </div>
            </Card>

            {/* KCC */}
            <Card className="rounded-3xl border border-violet-200 bg-violet-50/40 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-600">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <Badge className="bg-violet-100 text-violet-800 border-0 text-[10px] uppercase font-bold">
                    {t("scheme_credit", "Credit Scheme")}
                  </Badge>
                  <h3 className="mt-1 text-base font-bold text-gray-900">
                    {t("scheme_kcc_title", "Kisan Credit Card (KCC)")}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-violet-900">
                    {t("scheme_kcc_benefit", "Crop loans up to ₹5 lakh at just 4% interest")}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    {t(
                      "scheme_kcc_desc",
                      "Collateral-free up to ₹2 lakh. Apply via any bank branch, Kisan Rin Portal, or e-KCC digital process. Covers crop production & allied activities.",
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <p className="mt-3 text-center text-[10px] text-gray-400">
            Source: Ministry of Agriculture & Farmers Welfare, Govt. of India · myscheme.gov.in
          </p>
        </section>

        {/* ─── 5. PEST ALERT ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Pest & Outbreak Alerts</h2>
            </div>
            <Link
              to="/pest"
              className="flex items-center text-xs font-semibold text-green-600 hover:underline"
            >
              AI Disease Doctor <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-3xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="bg-amber-100 text-amber-800 border-0 text-[10px]">
                    High Outbreak Risk
                  </Badge>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">
                    Pink Bollworm Infestation
                  </h3>
                  <p className="text-xs text-gray-500">
                    Affecting Cotton · Reported 6km away in Guntur
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700 font-bold text-xs">
                  91%
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-600">
                🌿 Organic: Install 8 Pheromone traps/acre. 🧪 Chemical: Spray Profenofos 50% EC @
                2ml/L water.
              </p>
            </Card>

            <Card className="rounded-3xl border border-red-200 bg-red-50/40 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="bg-red-100 text-red-800 border-0 text-[10px]">
                    Critical Outbreak Risk
                  </Badge>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">
                    Early Blight (Alternaria)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Affecting Tomato / Potato · Reported in Nashik
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-100 text-red-700 font-bold text-xs">
                  95%
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-600">
                🌿 Organic: Spray Neem Oil (5ml/L). 🧪 Chemical: Spray Mancozeb 75% WP @ 2.5g/L
                water.
              </p>
            </Card>
          </div>
        </section>

        {/* ─── 6. MARKET PRICES ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Live Mandi Prices & AI Predictions
              </h2>
              <Badge className="ml-2 bg-gray-100 text-gray-500 border-0 text-[9px]">
                Source: Agmarknet.gov.in
              </Badge>
            </div>
            <Link
              to="/market"
              className="flex items-center text-xs font-semibold text-green-600 hover:underline"
            >
              View All Mandis <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                crop: "Onion (Red)",
                mandi: "Lasalgaon, Nashik",
                today: 2450,
                pred: 2680,
                change: "+9.4%",
                rec: "HOLD",
              },
              {
                crop: "Cotton (Long)",
                mandi: "Guntur Yard, AP",
                today: 7420,
                pred: 7150,
                change: "-3.6%",
                rec: "SELL NOW",
              },
              {
                crop: "Wheat (Sharbati)",
                mandi: "Karnal Mandi, HR",
                today: 2320,
                pred: 2480,
                change: "+6.8%",
                rec: "HOLD",
              },
            ].map((m) => (
              <Card
                key={m.crop}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">{m.crop}</h3>
                    <p className="text-[11px] text-gray-500">{m.mandi}</p>
                  </div>
                  <Badge
                    className={`text-[10px] ${m.rec === "HOLD" ? "bg-emerald-100 text-emerald-800 border-0" : "bg-red-100 text-red-800 border-0"}`}
                  >
                    {m.rec === "HOLD" ? "🟢 HOLD" : "🔴 SELL NOW"}
                  </Badge>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">
                      Today's Rate
                    </p>
                    <p className="text-xl font-extrabold text-gray-900">
                      ₹{m.today.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-green-700 uppercase font-semibold">
                      7-Day Target
                    </p>
                    <p className="text-xl font-extrabold text-green-700">
                      ₹{m.pred.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ─── 7. 🎥 SINGLE FEATURED AGRI REEL SPOTLIGHT ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-purple-600 fill-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Featured Agri Reel</h2>
            </div>
            <Link
              to="/reels"
              className="flex items-center text-xs font-semibold text-green-600 hover:underline"
            >
              Watch All Agri Reels <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Single Featured Reel Card */}
          <Link to="/reels" className="block">
            <Card className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-950 shadow-xl transition-all hover:shadow-2xl">
              <div className="relative aspect-[16/7] w-full overflow-hidden sm:aspect-[21/9]">
                <img
                  src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80"
                  alt="Jeevamrut Preparation in 200L Drum"
                  className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                  <Badge className="bg-green-600 text-white border-0 text-xs font-bold">
                    Featured Organic Reel
                  </Badge>
                </div>

                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white/25 text-white backdrop-blur-md shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-7 w-7 ml-1 fill-white" />
                  </span>
                </span>

                <div className="absolute inset-x-6 bottom-6 z-20 flex flex-col sm:flex-row sm:items-end sm:justify-between text-white gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-green-600 text-xs font-bold text-white">
                        R
                      </span>
                      <span className="text-xs font-bold drop-shadow-md">Ramesh Patil</span>
                      <span className="text-xs text-gray-300">· Nashik, MH</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
                      Jeevamrut Preparation in 200L Drum
                    </h3>
                    <p className="mt-1 text-xs text-gray-200 max-w-xl opacity-90 line-clamp-1">
                      Step-by-step ratio of cow dung, urine, jaggery and gram flour to boost soil
                      microbial activity.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                      <Eye className="h-4 w-4" /> 18.4K Views
                    </span>
                    <Button
                      size="sm"
                      className="rounded-full bg-green-600 font-bold text-white hover:bg-green-700"
                    >
                      {t("watch_reels", "Watch Reels")} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </section>

        {/* ─── 8. EQUIPMENT NEAR YOU ─── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tractor className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Equipment Near You</h2>
            </div>
            <Link
              to="/equipment"
              className="flex items-center text-xs font-semibold text-green-600 hover:underline"
            >
              Browse All Equipment <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Mahindra 575 DI Tractor (47 HP)",
                category: "Tractor",
                priceHr: 350,
                priceDay: 1800,
                owner: "Ramesh Patil",
                village: "Khed, Nashik",
                img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
                avail: true,
              },
              {
                name: "John Deere Combine Harvester",
                category: "Harvester",
                priceHr: 950,
                priceDay: 6500,
                owner: "Iqbal Singh",
                village: "Karnal, HR",
                img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
                avail: true,
              },
              {
                name: "DJI Agras T30 Agriculture Drone",
                category: "Drone",
                priceHr: 600,
                priceDay: 3500,
                owner: "Venkatesh Rao",
                village: "Guntur, AP",
                img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
                avail: true,
              },
            ].map((eq) => (
              <Card
                key={eq.name}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img src={eq.img} alt={eq.name} className="h-full w-full object-cover" />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 border-0 text-xs">
                    {eq.category}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-emerald-500 text-white border-0 text-xs font-semibold">
                    Available Now
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-extrabold text-gray-900 text-base">{eq.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    📍 {eq.village} · Owner: {eq.owner}
                  </p>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-extrabold text-green-700">₹{eq.priceHr}</span>
                      <span className="text-xs text-gray-500"> / hr</span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-2xl bg-green-600 font-bold text-white hover:bg-green-700"
                    >
                      <Link to="/equipment">{t("book_now", "Book Now")}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* ─── 9. FOOTER ─── */}
      <Footer />
    </div>
  );
}
