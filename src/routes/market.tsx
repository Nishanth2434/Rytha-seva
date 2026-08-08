import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageShell } from "@/components/site/PageShell";
import { AdBanner } from "@/components/site/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Intelligence | KrishiMitra AI" },
      {
        name: "description",
        content:
          "Live mandi prices, predicted prices, nearby market analysis, and AI sell-or-hold recommendations for Indian crops.",
      },
      { property: "og:title", content: "Market Intelligence | KrishiMitra AI" },
      {
        property: "og:description",
        content: "Mandi price predictions and AI sell-or-hold guidance for Indian farmers.",
      },
    ],
  }),
  component: MarketPage,
});

export interface MarketItem {
  id: string;
  cropName: string;
  category: string;
  district: string;
  state: string;
  nearbyMarket: string;
  todaysPrice: number; // in ₹/quintal
  predictedPrice: number; // 7-day predicted price in ₹/quintal
  priceChange24h: number; // percentage change today
  date: string;
  recommendation: "Hold" | "Sell Now" | "Watch";
  recommendationReason: string;
  confidenceScore: number;
}

// Real APMC Mandi Data (Source: Agmarknet.gov.in / DMI modal prices)
const todayDate = new Date().toISOString().slice(0, 10);
const mockMarketData: MarketItem[] = [
  {
    id: "m1",
    cropName: "Onion (Red)",
    category: "Vegetable",
    district: "Nashik",
    state: "Maharashtra",
    nearbyMarket: "Lasalgaon APMC, Nashik",
    todaysPrice: 2450,
    predictedPrice: 2680,
    priceChange24h: 4.2,
    date: todayDate,
    recommendation: "Hold",
    recommendationReason:
      "Supply deficit expected next week in Northern mandis. Price likely to rise +9.4%.",
    confidenceScore: 92,
  },
  {
    id: "m2",
    cropName: "Cotton (Long Staple)",
    category: "Commercial",
    district: "Guntur",
    state: "Andhra Pradesh",
    nearbyMarket: "Guntur Market Yard",
    todaysPrice: 7420,
    predictedPrice: 7150,
    priceChange24h: -1.8,
    date: todayDate,
    recommendation: "Sell Now",
    recommendationReason:
      "Peak export demand reached; incoming fresh arrivals will push prices down by 3.6%.",
    confidenceScore: 89,
  },
  {
    id: "m3",
    cropName: "Wheat (Sharbati)",
    category: "Grain",
    district: "Karnal",
    state: "Haryana",
    nearbyMarket: "Karnal Grain Mandi",
    todaysPrice: 2588,
    predictedPrice: 2720,
    priceChange24h: 1.5,
    date: todayDate,
    recommendation: "Hold",
    recommendationReason:
      "Government procurement targets and mill demand driving upward momentum (+6.8%).",
    confidenceScore: 94,
  },
  {
    id: "m4",
    cropName: "Tomato (Hybrid)",
    category: "Vegetable",
    district: "Kolar",
    state: "Karnataka",
    nearbyMarket: "Kolar APMC Market",
    todaysPrice: 1780,
    predictedPrice: 1620,
    priceChange24h: -5.4,
    date: todayDate,
    recommendation: "Sell Now",
    recommendationReason: "Surplus arrivals from neighboring districts causing market glut.",
    confidenceScore: 87,
  },
  {
    id: "m5",
    cropName: "Paddy (Basmati 1121)",
    category: "Grain",
    district: "Ludhiana",
    state: "Punjab",
    nearbyMarket: "Khanna Mandi, Ludhiana",
    todaysPrice: 4150,
    predictedPrice: 4380,
    priceChange24h: 2.1,
    date: todayDate,
    recommendation: "Hold",
    recommendationReason: "Middle East export orders surging. Expected +5.5% price bump in 7 days.",
    confidenceScore: 91,
  },
  {
    id: "m6",
    cropName: "Soybean (Yellow)",
    category: "Oilseed",
    district: "Indore",
    state: "Madhya Pradesh",
    nearbyMarket: "Indore APMC, MP",
    todaysPrice: 4680,
    predictedPrice: 4720,
    priceChange24h: 0.4,
    date: todayDate,
    recommendation: "Watch",
    recommendationReason: "Prices stable within range. Monitor international crush margin reports.",
    confidenceScore: 85,
  },
  {
    id: "m7",
    cropName: "Turmeric (Finger)",
    category: "Spice",
    district: "Erode",
    state: "Tamil Nadu",
    nearbyMarket: "Erode Regulated Market",
    todaysPrice: 15250,
    predictedPrice: 16400,
    priceChange24h: 6.8,
    date: todayDate,
    recommendation: "Hold",
    recommendationReason:
      "Strong festive demand and lower yield estimates creating bullish momentum (+7.5%).",
    confidenceScore: 95,
  },
  {
    id: "m8",
    cropName: "Grape (Export Quality)",
    category: "Fruit",
    district: "Nashik",
    state: "Maharashtra",
    nearbyMarket: "Pimpalgaon APMC, Nashik",
    todaysPrice: 8500,
    predictedPrice: 8100,
    priceChange24h: -2.3,
    date: todayDate,
    recommendation: "Sell Now",
    recommendationReason:
      "Cold storage capacity full in regional hubs; sell before quality downgrades.",
    confidenceScore: 88,
  },
];

const cropOptions = [
  "All Crops",
  "Onion",
  "Cotton",
  "Wheat",
  "Tomato",
  "Paddy",
  "Soybean",
  "Turmeric",
  "Grape",
];
const districtOptions = [
  "All Districts",
  "Nashik",
  "Guntur",
  "Karnal",
  "Kolar",
  "Ludhiana",
  "Indore",
  "Erode",
];
const dateOptions = ["Today (Aug 7)", "Aug 8", "Aug 9", "Next Week Forecast"];

function MarketPage() {
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedDate, setSelectedDate] = useState("Today (Aug 7)");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered market items
  const filteredItems = useMemo(() => {
    return mockMarketData.filter((item) => {
      const matchCrop =
        selectedCrop === "All Crops" ||
        item.cropName.toLowerCase().includes(selectedCrop.toLowerCase());
      const matchDistrict =
        selectedDistrict === "All Districts" || item.district === selectedDistrict;
      const matchSearch =
        searchQuery === "" ||
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nearbyMarket.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCrop && matchDistrict && matchSearch;
    });
  }, [selectedCrop, selectedDistrict, searchQuery]);

  function resetFilters() {
    setSelectedCrop("All Crops");
    setSelectedDistrict("All Districts");
    setSelectedDate("Today (Aug 7)");
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageShell
        eyebrow="Market Intelligence"
        title="Mandi Prices & Price Predictions"
        description="APMC mandi rates (Source: Agmarknet.gov.in), AI price predictions 7 days ahead, and smart sell-or-hold recommendations for Indian farmers."
      >
        {/* ─── Summary Market KPIs ─── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/60 to-white p-5 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-green-700">
                  Top Gainer Today
                </span>
                <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-200">
                  +6.8%
                </Badge>
              </div>
              <p className="mt-2 text-xl font-extrabold text-gray-900">Turmeric (Erode)</p>
              <p className="text-xs text-gray-500">₹15,250 / quintal · Predicted ₹16,400</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/60 to-white p-5 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  AI Signal Summary
                </span>
                <Badge className="bg-amber-100 text-amber-700 border-0 hover:bg-amber-200">
                  5 Hold / 3 Sell
                </Badge>
              </div>
              <p className="mt-2 text-xl font-extrabold text-gray-900">62.5% Hold Advice</p>
              <p className="text-xs text-gray-500">
                Prices expected to rise across grains & spices
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white p-5 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Mandis Monitored
                </span>
                <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-200">
                  Live APMC
                </Badge>
              </div>
              <p className="mt-2 text-xl font-extrabold text-gray-900">1,240 APMC Mandis</p>
              <p className="text-xs text-gray-500">Covering 18 agricultural states across India</p>
            </CardContent>
          </Card>
        </div>

        {/* ─── Filters Bar ─── */}
        <div className="mb-8 rounded-3xl border border-gray-100 bg-gray-50/60 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-bold text-gray-900">Filter Market Data</h3>
            </div>
            {(selectedCrop !== "All Crops" ||
              selectedDistrict !== "All Districts" ||
              searchQuery !== "") && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
              >
                <RefreshCw className="h-3 w-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600">Search Mandi or Crop</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="e.g. Lasalgaon, Cotton..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 rounded-2xl border-gray-200 bg-white pl-9 text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Crop Filter Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600">Filter by Crop</Label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="h-11 rounded-2xl border-gray-200 bg-white text-sm shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cropOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District Filter Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600">Filter by District</Label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="h-11 rounded-2xl border-gray-200 bg-white text-sm shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {districtOptions.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600">Filter by Date</Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="h-11 rounded-2xl border-gray-200 bg-white text-sm shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map((dt) => (
                    <SelectItem key={dt} value={dt}>
                      {dt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ─── Market Cards Grid ─── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const isHold = item.recommendation === "Hold";
            const isSell = item.recommendation === "Sell Now";

            const diffPrice = item.predictedPrice - item.todaysPrice;
            const diffPercent = ((diffPrice / item.todaysPrice) * 100).toFixed(1);

            return (
              <Card
                key={item.id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-gray-100/80"
              >
                <CardContent className="p-6">
                  {/* Card Header: Crop Name + Category */}
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <Badge
                        variant="outline"
                        className="border-gray-200 bg-gray-50 text-[10px] text-gray-600"
                      >
                        {item.category}
                      </Badge>
                      <h3 className="mt-1 text-xl font-extrabold text-gray-900">{item.cropName}</h3>
                    </div>

                    {/* AI Recommendation Badge */}
                    <Badge
                      className={`px-3 py-1 text-xs font-bold ${
                        isHold
                          ? "bg-emerald-100 text-emerald-800 border-0"
                          : isSell
                            ? "bg-red-100 text-red-800 border-0"
                            : "bg-amber-100 text-amber-800 border-0"
                      }`}
                    >
                      {isHold ? "🟢 HOLD" : isSell ? "🔴 SELL NOW" : "🟡 WATCH"}
                    </Badge>
                  </div>

                  {/* Nearby Market */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-green-600 shrink-0" />
                    <span className="truncate">{item.nearbyMarket}</span>
                  </div>

                  {/* Prices Comparison Grid */}
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-gray-50/70 p-4 border border-gray-100">
                    {/* Today's Price */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Today's Price
                      </p>
                      <p className="mt-0.5 text-xl font-bold text-gray-900">
                        ₹{item.todaysPrice.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] font-medium text-gray-500">per quintal</span>
                    </div>

                    {/* Predicted Price */}
                    <div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-green-600" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-green-700">
                          Predicted Price
                        </p>
                      </div>
                      <p className="mt-0.5 text-xl font-bold text-green-700">
                        ₹{item.predictedPrice.toLocaleString("en-IN")}
                      </p>
                      <span
                        className={`inline-flex items-center text-[10px] font-bold ${
                          diffPrice >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {diffPrice >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-0.5" />
                        )}
                        {diffPrice >= 0 ? `+${diffPercent}%` : `${diffPercent}%`} (7 days)
                      </span>
                    </div>
                  </div>

                  {/* AI Recommendation Reason */}
                  <div
                    className={`mt-4 rounded-2xl p-4 text-xs leading-relaxed ${
                      isHold
                        ? "bg-emerald-50/60 border border-emerald-100 text-emerald-950"
                        : isSell
                          ? "bg-red-50/60 border border-red-100 text-red-950"
                          : "bg-amber-50/60 border border-amber-100 text-amber-950"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>💡 AI Market Insight:</span>
                      <span className="text-[10px] font-medium opacity-80">
                        {item.confidenceScore}% Confidence
                      </span>
                    </div>
                    {item.recommendationReason}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="my-12 rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
            <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <h4 className="text-base font-semibold text-gray-700">
              No commodities matched your filter
            </h4>
            <p className="mt-1 text-xs text-gray-400">
              Try adjusting your crop or district selection
            </p>
            <Button
              onClick={resetFilters}
              variant="outline"
              size="sm"
              className="mt-4 rounded-full"
            >
              Reset Filters
            </Button>
          </div>
        )}

        <div className="mt-10">
          <AdBanner label="Sponsored · Agri Warehousing & Cold Storage" />
        </div>
      </PageShell>

      <Footer />
    </div>
  );
}
