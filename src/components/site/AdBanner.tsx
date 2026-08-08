import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Sparkles, Sprout, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  banner_image_url: string | null;
  cta_text: string;
  external_link: string;
  badge_text: string;
  is_enabled: boolean;
}

const defaultAds: Advertisement[] = [
  {
    id: "default-ad-1",
    title: "Nova Agri Seeds - Certified Hybrid Seeds at 20% Off",
    description:
      "Free soil-health test with every order above ₹2,000. Verified high-yield seeds for Kharif & Rabi seasons from Nova Agri Tech.",
    banner_image_url:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
    cta_text: "Claim This Offer",
    external_link: "https://novaagri.in/nova-agri-seeds/",
    badge_text: "Sponsored · Nova Agri Seeds",
    is_enabled: true,
  },
  {
    id: "default-ad-2",
    title: "Sonalika Heavy Duty Tractors - India's No.1 Export Brand",
    description:
      "Explore heavy-duty Sonalika tractors with advanced HDM engines, zero-down payment options, and 5-year warranty.",
    banner_image_url:
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80",
    cta_text: "Explore Sonalika",
    external_link: "https://www.sonalika.com/",
    badge_text: "Sponsored · Sonalika Tractors",
    is_enabled: true,
  },
  {
    id: "default-ad-3",
    title: "Kisan Machinery Finance - Low Interest Equipment Loans",
    description:
      "Easy financing & government subsidies for new solar water pumps, harvesters, and tractors.",
    banner_image_url:
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80",
    cta_text: "View Subsidies",
    external_link: "https://novaagri.in/nova-agri-seeds/",
    badge_text: "Sponsored · Farm Finance",
    is_enabled: true,
  },
];

export function AdBanner({ label }: { label?: string; category?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: liveAds } = useQuery<Advertisement[]>({
    queryKey: ["live-advertisements"],
    queryFn: async () => {
      const { data, error } = await apiRequest<Advertisement[]>("/advertisements/");
      if (error || !data || data.length === 0) {
        return defaultAds;
      }
      return data.filter((item) => item.is_enabled !== false);
    },
  });

  const ads = (liveAds && liveAds.length > 0) ? liveAds : defaultAds;
  const currentAd = ads[currentIndex % ads.length] || ads[0]!;

  // Auto-rotating timer every 6 seconds
  useEffect(() => {
    if (isPaused || ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <aside
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="group relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-50/80 via-emerald-50/50 to-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-green-200"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          {currentAd.banner_image_url ? (
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm">
              <img
                src={currentAd.banner_image_url}
                alt={currentAd.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700">
              <Sprout className="h-8 w-8" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-green-200 bg-white text-[10px] font-bold text-green-700"
              >
                <Sparkles className="mr-1 h-3 w-3 text-green-600" />
                {label || currentAd.badge_text}
              </Badge>
              {ads.length > 1 && (
                <span className="text-[10px] font-semibold text-gray-400">
                  Ad {currentIndex + 1} of {ads.length}
                </span>
              )}
            </div>

            <h4 className="text-base font-extrabold text-gray-900 transition-all">
              {currentAd.title}
            </h4>

            <p className="text-xs leading-relaxed text-gray-600 max-w-2xl">
              {currentAd.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            asChild
            size="sm"
            className="rounded-2xl bg-green-600 px-5 font-bold text-white shadow-md shadow-green-200 transition-all hover:bg-green-700"
          >
            <a
              href={currentAd.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              {currentAd.cta_text}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>

          {/* Prev / Next Navigation Arrows for Multi-Ads */}
          {ads.length > 1 && (
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-gray-200/60 shadow-sm">
              <button
                type="button"
                onClick={handlePrev}
                title="Previous Ad"
                className="grid h-8 w-8 place-items-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-green-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                title="Next Ad"
                className="grid h-8 w-8 place-items-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-green-700 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide Progress Indicator Dots */}
      {ads.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5 pt-2 border-t border-gray-100">
          {ads.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? "w-6 bg-green-600" : "w-1.5 bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
