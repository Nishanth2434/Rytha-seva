import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  MapPin,
  Tractor,
  Lock,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageShell } from "@/components/site/PageShell";
import { AdBanner } from "@/components/site/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment Booking | KrishiMitra AI" },
      {
        name: "description",
        content:
          "Rent tractors, harvesters, rotavators, sprayers and drones from nearby verified owners by the hour or day.",
      },
      { property: "og:title", content: "Equipment Booking | KrishiMitra AI" },
      {
        property: "og:description",
        content: "Rent farm machinery from nearby owners by the hour.",
      },
    ],
  }),
  component: EquipmentPage,
});

export type EquipmentItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  price_per_hour: number;
  price_per_day: number;
  owner_name: string;
  village: string;
  is_available: boolean;
};

const mockEquipmentList: EquipmentItem[] = [
  {
    id: "eq-1",
    name: "Mahindra 575 DI Tractor (47 HP)",
    category: "Tractor",
    description:
      "Ideal for deep ploughing, tilling, haulage and rotavator attachment in mid to large fields.",
    image_url:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
    price_per_hour: 350,
    price_per_day: 1800,
    owner_name: "Ramesh Patil",
    village: "Khed, Nashik (MH)",
    is_available: true,
  },
  {
    id: "eq-2",
    name: "John Deere Combine Harvester 5050D",
    category: "Harvester",
    description:
      "Self-propelled multi-crop harvester suitable for paddy and wheat harvesting with minimal grain loss.",
    image_url:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    price_per_hour: 950,
    price_per_day: 6500,
    owner_name: "Iqbal Singh",
    village: "Karnal, Haryana (HR)",
    is_available: true,
  },
];

interface DjangoEquipment {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  price_per_day: string | number;
  price_per_hour?: string | number;
  location?: string;
  is_available: boolean;
  owner_detail?: { full_name?: string; village?: string };
}

function EquipmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [hoursNeeded, setHoursNeeded] = useState(4);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const { data: dbData, isLoading } = useQuery({
    queryKey: ["equipment-page-items"],
    queryFn: async () => {
      const { data, error } = await apiRequest<DjangoEquipment[]>("/equipment/");

      if (error || !data || data.length === 0) {
        return mockEquipmentList;
      }

      return data.map((row) => {
        const perDay = Number(row.price_per_day);
        const perHour = row.price_per_hour ? Number(row.price_per_hour) : Math.round(perDay / 6);
        return {
          id: row.id,
          name: row.name,
          category: row.category || "Machinery",
          description: null,
          image_url: row.image_url || mockEquipmentList[0]?.image_url || null,
          price_per_hour: perHour,
          price_per_day: perDay,
          owner_name: row.owner_detail?.full_name || "Verified Owner",
          village: row.location || row.owner_detail?.village || "Local Village",
          is_available: row.is_available,
        };
      });
    },
  });

  const equipmentList = dbData || mockEquipmentList;

  const filteredEquipment = equipmentList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.village.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.owner_name.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  function handleBookNowClick(item: EquipmentItem) {
    if (!user) {
      toast.error("Authentication required to book equipment", {
        description: "Please sign in to your farmer account first.",
      });
      navigate({ to: "/login" });
      return;
    }
    setSelectedItem(item);
  }

  async function submitBooking() {
    if (!selectedItem || !user) return;
    if (!bookingDate) {
      toast.error("Please select a booking date");
      return;
    }

    setIsSubmitting(true);
    const calculatedTotal = hoursNeeded * selectedItem.price_per_hour;

    try {
      const { error } = await apiRequest("/bookings/", {
        method: "POST",
        body: JSON.stringify({
          equipment: selectedItem.id,
          start_date: bookingDate,
          end_date: bookingDate,
          total_price: calculatedTotal,
          notes: `${hoursNeeded} hours booking. Note: ${notes}`,
        }),
      });

      if (error) {
        toast.error(error);
      } else {
        toast.success(`Booking request sent for ${selectedItem.name}!`, {
          description: `Total: ₹${calculatedTotal.toLocaleString("en-IN")} for ${hoursNeeded} hours.`,
        });
        setSelectedItem(null);
        setBookingDate("");
        setHoursNeeded(4);
        setNotes("");
      }
    } catch {
      toast.error("Failed to place booking request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageShell
        eyebrow="Agricultural Machinery"
        title="Equipment Booking"
        description="Rent tractors, harvesters, rotavators, sprayers and drones directly from verified owners in nearby villages by the hour."
      >
        {!user && (
          <div className="mb-8 flex flex-col items-start gap-4 rounded-3xl border border-green-200 bg-gradient-to-r from-green-50/80 to-emerald-50/40 p-6 sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-700">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-base font-bold text-gray-900">Sign in to Book Machinery</h4>
                <p className="text-xs text-gray-600">
                  Browsing equipment is open to all farmers. Sign in when you are ready to book.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate({ to: "/login" })}
              className="rounded-2xl bg-green-600 px-6 shadow-md shadow-green-200 hover:bg-green-700"
            >
              Sign in / Create Account
            </Button>
          </div>
        )}

        <div className="mb-8 space-y-4 rounded-3xl border border-gray-100 bg-gray-50/60 p-4 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by equipment, category, owner or village..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="h-12 rounded-2xl border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm focus-visible:ring-green-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-gray-500 mr-1">Categories:</span>
            {[
              { label: "All", value: "" },
              { label: "🚜 Tractor", value: "Tractor" },
              { label: "🌾 Harvester", value: "Harvester" },
              { label: "💦 Sprayer", value: "Sprayer" },
              { label: "🛸 Drone", value: "Drone" },
              { label: "👨‍🌾 Labours", value: "Labours" },
              { label: "🌱 Cultivator", value: "Cultivator" },
              { label: "🌾 Seeder", value: "Seeder" },
              { label: "💧 Irrigation", value: "Irrigation" },
            ].map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setSearchFilter(cat.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  searchFilter === cat.value
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] rounded-3xl" />
            ))}

          {!isLoading &&
            filteredEquipment.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-gray-100/80"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-gray-400">
                      <Tractor className="h-12 w-12" />
                    </div>
                  )}

                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 backdrop-blur-md hover:bg-white border-0 text-xs shadow-sm">
                    {item.category}
                  </Badge>

                  <Badge
                    className={`absolute top-3 right-3 border-0 text-xs shadow-sm px-3 py-1 font-semibold ${
                      item.is_available ? "bg-emerald-500 text-white" : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {item.is_available ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Available Now
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Booked
                      </span>
                    )}
                  </Badge>
                </div>

                <CardContent className="flex flex-col justify-between p-6">
                  <div>
                    <h3 className="line-clamp-1 text-lg font-extrabold text-gray-900">
                      {item.name}
                    </h3>

                    <div className="mt-3 space-y-1.5 border-b border-gray-100 pb-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-green-600" />
                        <span className="font-semibold text-gray-800">Owner:</span>{" "}
                        {item.owner_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-green-600" />
                        <span className="font-semibold text-gray-800">Village:</span> {item.village}
                      </div>
                    </div>

                    {item.description && (
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-green-700">
                          ₹{item.price_per_hour}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">/ hr</span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        ₹{item.price_per_day.toLocaleString("en-IN")} / day
                      </p>
                    </div>

                    <Button
                      onClick={() => handleBookNowClick(item)}
                      disabled={!item.is_available}
                      className={`rounded-2xl px-6 font-semibold shadow-md transition-all ${
                        item.is_available
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                    >
                      {item.is_available ? "Book Now" : "Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-md rounded-3xl border-gray-100 bg-white p-6 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-gray-900">
                Book {selectedItem?.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Owner:{" "}
                <span className="font-semibold text-gray-800">{selectedItem?.owner_name}</span> ·{" "}
                {selectedItem?.village}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4 border border-green-100 text-sm">
                <span className="font-semibold text-green-800">Rate:</span>
                <span className="font-bold text-green-900">
                  ₹{selectedItem?.price_per_hour} / hour (₹{selectedItem?.price_per_day} / day)
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="b-date" className="text-xs font-semibold text-gray-700">
                  Booking Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="b-date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="h-11 rounded-2xl border-gray-200 pl-10 text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <Label htmlFor="hours">Duration (Hours)</Label>
                  <span className="text-green-700 font-bold">{hoursNeeded} Hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    id="hours"
                    type="number"
                    min={1}
                    max={24}
                    value={hoursNeeded}
                    onChange={(e) => setHoursNeeded(Math.max(1, Number(e.target.value)))}
                    className="h-11 rounded-2xl border-gray-200 text-sm shadow-sm"
                  />
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="b-notes" className="text-xs font-semibold text-gray-700">
                  Notes for Owner (Optional)
                </Label>
                <Input
                  id="b-notes"
                  type="text"
                  placeholder="e.g. Field located near water pump house..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-11 rounded-2xl border-gray-200 text-sm shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-semibold text-gray-700">Total Estimated Price:</span>
                <span className="text-2xl font-extrabold text-green-700">
                  ₹{((selectedItem?.price_per_hour || 0) * hoursNeeded).toLocaleString("en-IN")}
                </span>
              </div>

              <Button
                onClick={submitBooking}
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl bg-green-600 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700"
              >
                {isSubmitting ? "Sending Request..." : "Confirm Booking Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-12">
          <AdBanner label="Sponsored · Machinery Loans & Subsidies" />
        </div>
      </PageShell>

      <Footer />
    </div>
  );
}
