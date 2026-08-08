import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Heart,
  Eye,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Info,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageShell } from "@/components/site/PageShell";
import { AdBanner } from "@/components/site/AdBanner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reels")({
  head: () => ({
    meta: [
      { title: "Agri Reels | KrishiMitra AI" },
      {
        name: "description",
        content:
          "Short practical farming videos on organic farming, machinery, crop care, weather, pest control, government schemes and market tips.",
      },
      { property: "og:title", content: "Agri Reels | KrishiMitra AI" },
      {
        property: "og:description",
        content: "Short practical farming reels from farmers across India.",
      },
    ],
  }),
  component: ReelsPage,
});

export interface AgriReel {
  id: string;
  title: string;
  description: string;
  category:
    | "Organic Farming"
    | "Machinery"
    | "Crop Care"
    | "Weather"
    | "Pest Control"
    | "Government Schemes"
    | "Market Tips";
  videoUrl: string;
  thumbnail: string;
  views: string;
  likes: number;
  author: string;
  location: string;
}

const categoriesList = [
  "All Categories",
  "Organic Farming",
  "Machinery",
  "Crop Care",
  "Weather",
  "Pest Control",
  "Government Schemes",
  "Market Tips",
] as const;

const mockReelsList: AgriReel[] = [
  {
    id: "reel-1",
    title: "Jeevamrut Preparation in 200L Drum",
    description:
      "Step-by-step ratio of cow dung, urine, jaggery and gram flour to boost soil microbial activity natively.",
    category: "Organic Farming",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80",
    views: "18.4K",
    likes: 1420,
    author: "Ramesh Patil",
    location: "Nashik, MH",
  },
  {
    id: "reel-2",
    title: "Laser Land Leveler Settings & Operation",
    description:
      "Save up to 35% irrigation water by precision levelling your field before paddy sowing.",
    category: "Machinery",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
    views: "24.1K",
    likes: 2890,
    author: "Iqbal Singh",
    location: "Karnal, HR",
  },
  {
    id: "reel-3",
    title: "PM-Kisan 17th Installment Status Check",
    description:
      "Quick guide to verify e-KYC status and direct bank transfer eligibility on the PM-Kisan portal.",
    category: "Government Schemes",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    views: "42.8K",
    likes: 5120,
    author: "KrishiMitra Govt Desk",
    location: "New Delhi",
  },
  {
    id: "reel-4",
    title: "Pink Bollworm Trap Setup in Cotton",
    description:
      "Install 8 Pheromone traps per acre at canopy height to capture adult male moths early.",
    category: "Pest Control",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
    views: "15.9K",
    likes: 1840,
    author: "Sunita Reddy",
    location: "Guntur, AP",
  },
  {
    id: "reel-5",
    title: "How to Read Mandi Arrivals Before Selling",
    description:
      "Check daily arrival tonnage across neighboring mandis to get maximum price for your produce.",
    category: "Market Tips",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1470072768013-bf9532016c10?auto=format&fit=crop&w=600&q=80",
    views: "31.2K",
    likes: 3450,
    author: "Anil Deshmukh",
    location: "Akola, MH",
  },
  {
    id: "reel-6",
    title: "Pre-Monsoon Foliar Micronutrient Spray",
    description:
      "Blend Zinc & Boron spray before heavy rains to prevent flower drop in fruiting crops.",
    category: "Crop Care",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    views: "12.7K",
    likes: 1120,
    author: "Venkatesh Rao",
    location: "Mandya, KA",
  },
  {
    id: "reel-7",
    title: "Understanding Hyperlocal Weather Radar",
    description: "How to read rain cloud movement 6 hours ahead on your smartphone map.",
    category: "Weather",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=600&q=80",
    views: "19.3K",
    likes: 2150,
    author: "Weather Desk",
    location: "IMD Pune",
  },
];

function ReelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockReelsList.forEach((r) => {
      initial[r.id] = r.likes;
    });
    return initial;
  });
  const [isMuted, setIsMuted] = useState(true);

  // Horizontal scroll refs for smooth navigation
  const scrollRefAll = useRef<HTMLDivElement>(null);
  const scrollRefOrganic = useRef<HTMLDivElement>(null);
  const scrollRefMachinery = useRef<HTMLDivElement>(null);

  function scroll(ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  // Filtered reels list
  const filteredReels = mockReelsList.filter(
    (reel) => selectedCategory === "All Categories" || reel.category === selectedCategory,
  );

  function togglePlay(id: string) {
    setActivePlayingId((prev) => (prev === id ? null : id));
  }

  function toggleLike(id: string) {
    setLikedMap((prev) => {
      const currentlyLiked = prev[id];
      setLikeCounts((counts) => ({
        ...counts,
        [id]: (counts[id] || 0) + (currentlyLiked ? -1 : 1),
      }));
      return { ...prev, [id]: !currentlyLiked };
    });
  }

  function handleShare(reel: AgriReel) {
    if (navigator.share) {
      navigator
        .share({
          title: reel.title,
          text: `${reel.title} - Watch on KrishiMitra AI`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Reel link copied to clipboard!");
    }
  }

  // Render a single 9:16 Reel Card
  function ReelCard({ reel }: { reel: AgriReel }) {
    const isPlaying = activePlayingId === reel.id;
    const isLiked = likedMap[reel.id];
    const currentLikes = likeCounts[reel.id] || reel.likes;

    return (
      <Card
        key={reel.id}
        className="group relative shrink-0 w-[290px] sm:w-[320px] snap-start overflow-hidden rounded-3xl border border-gray-100 bg-gray-950 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden">
          {isPlaying ? (
            <video
              src={reel.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={reel.thumbnail}
              alt={reel.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-white/20 text-white backdrop-blur-md border-0 text-[10px] font-semibold">
              {reel.category}
            </Badge>
          </div>

          {isPlaying && (
            <button
              onClick={() => setIsMuted((v) => !v)}
              className="absolute top-4 right-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}

          <button
            onClick={() => togglePlay(reel.id)}
            className="absolute inset-0 z-10 grid place-items-center bg-transparent"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/25 text-white backdrop-blur-md shadow-2xl transition-transform duration-300 group-hover:scale-110">
              {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
            </span>
          </button>

          <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(reel.id);
              }}
              className="flex flex-col items-center gap-1 group/btn"
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-all ${
                  isLiked
                    ? "bg-red-500 text-white scale-110"
                    : "bg-black/40 text-white hover:bg-black/60"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-white" : ""}`} />
              </span>
              <span className="text-[11px] font-bold drop-shadow-md">{currentLikes}</span>
            </button>

            <div className="flex flex-col items-center gap-1">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md">
                <Eye className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-bold drop-shadow-md">{reel.views}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare(reel);
              }}
              className="flex flex-col items-center gap-1"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60">
                <Share2 className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-bold drop-shadow-md">Share</span>
            </button>
          </div>

          <div className="absolute inset-x-4 bottom-4 z-20 text-white pr-14">
            <div className="flex items-center gap-2 mb-1">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-green-600 text-xs font-bold text-white">
                {reel.author[0]}
              </span>
              <span className="text-xs font-bold text-white drop-shadow-md">{reel.author}</span>
              <span className="text-[10px] text-gray-300">· {reel.location}</span>
            </div>

            <h3 className="line-clamp-2 text-base font-extrabold text-white drop-shadow-md">
              {reel.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs text-gray-200 opacity-90 drop-shadow">
              {reel.description}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageShell
        eyebrow="Agricultural Video Feed"
        title="Agri Reels"
        description="Swipe left to right to watch reels after reels. Short practical farming lessons, machinery demos, and expert advice."
      >
        {/* ─── Category Filter Bar ─── */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-green-600 text-white shadow-md shadow-green-200"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 1. MAIN LEFT-TO-RIGHT HORIZONTAL REELS SCROLL SECTION ─── */}
        <section className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600 fill-orange-600" />
              <h2 className="text-xl font-extrabold text-gray-900">
                {selectedCategory === "All Categories" ? "Trending Reels Stream" : selectedCategory}
              </h2>
            </div>

            {/* Left & Right Scroll Control Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll(scrollRefAll, "left")}
                className="h-9 w-9 rounded-full border-gray-200 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll(scrollRefAll, "right")}
                className="h-9 w-9 rounded-full border-gray-200 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          </div>

          {/* Horizontal Left-to-Right Reel Slider */}
          <div
            ref={scrollRefAll}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 no-scrollbar"
            style={{ scrollbarWidth: "none" }}
          >
            {filteredReels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </section>

        {/* ─── 2. CATEGORY SECTION: ORGANIC & CROP CARE REELS ─── */}
        {selectedCategory === "All Categories" && (
          <section className="mt-12 space-y-4">
            <div className="flex items-center justify-between border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-extrabold text-gray-900">
                  Organic Farming & Crop Care
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll(scrollRefOrganic, "left")}
                  className="h-9 w-9 rounded-full border-gray-200 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll(scrollRefOrganic, "right")}
                  className="h-9 w-9 rounded-full border-gray-200 hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
            </div>

            {/* Horizontal Left-to-Right Slider */}
            <div
              ref={scrollRefOrganic}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2"
              style={{ scrollbarWidth: "none" }}
            >
              {mockReelsList
                .filter((r) => r.category === "Organic Farming" || r.category === "Crop Care")
                .map((reel) => (
                  <ReelCard key={reel.id} reel={reel} />
                ))}
            </div>
          </section>
        )}

        {/* ─── 3. CATEGORY SECTION: MACHINERY & GOVT SCHEMES REELS ─── */}
        {selectedCategory === "All Categories" && (
          <section className="mt-12 space-y-4">
            <div className="flex items-center justify-between border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-0">Tech & Schemes</Badge>
                <h2 className="text-xl font-extrabold text-gray-900">Machinery & Govt Schemes</h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll(scrollRefMachinery, "left")}
                  className="h-9 w-9 rounded-full border-gray-200 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll(scrollRefMachinery, "right")}
                  className="h-9 w-9 rounded-full border-gray-200 hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </Button>
              </div>
            </div>

            {/* Horizontal Left-to-Right Slider */}
            <div
              ref={scrollRefMachinery}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2"
              style={{ scrollbarWidth: "none" }}
            >
              {mockReelsList
                .filter(
                  (r) =>
                    r.category === "Machinery" ||
                    r.category === "Government Schemes" ||
                    r.category === "Market Tips",
                )
                .map((reel) => (
                  <ReelCard key={reel.id} reel={reel} />
                ))}
            </div>
          </section>
        )}

        {/* Django Content Verification Notice */}
        <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50/60 p-5 text-xs text-gray-600">
          <div className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
            <Info className="h-4 w-4 text-green-600" /> Expert Content Publishing
          </div>
          All Agri Reels are verified by agricultural extension experts and managed directly via the Django Admin Console.
        </div>

        <div className="mt-8">
          <AdBanner label="Sponsored · Agri Implements" />
        </div>
      </PageShell>

      <Footer />
    </div>
  );
}
