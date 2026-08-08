import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Tractor,
  CalendarCheck,
  IndianRupee,
  User,
  Plus,
  Trash2,
  Check,
  X,
  Clock,
  TrendingUp,
  MapPin,
  LogOut,
  Upload,
  Navigation,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest, clearAuthTokens } from "@/lib/api-client";

export const Route = createFileRoute("/_authenticated/owner/dashboard")({
  head: () => ({
    meta: [
      { title: "Equipment Owner Dashboard | KrishiMitra AI" },
      {
        name: "description",
        content:
          "Manage farm equipment listings, pending booking requests, daily revenue and profile.",
      },
      { property: "og:title", content: "Equipment Owner Dashboard | KrishiMitra AI" },
      {
        property: "og:description",
        content: "Equipment owner console for listings, bookings and earnings.",
      },
    ],
  }),
  component: OwnerDashboard,
});

type SidebarTab = "dashboard" | "equipment" | "bookings" | "revenue" | "profile";

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  price_per_day: number;
  location: string | null;
  is_available: boolean;
}

export interface BookingItem {
  id: string;
  equipment_name: string;
  farmer_name: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  created_at: string;
}

interface DjangoEquipment {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  price_per_day: string | number;
  location?: string;
  is_available: boolean;
}

interface DjangoBooking {
  id: string;
  equipment_detail?: { name: string };
  farmer_detail?: { full_name?: string; email?: string };
  start_date: string;
  end_date: string;
  total_price: string | number;
  status: string;
  created_at: string;
}

function OwnerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Tractor",
    description: "",
    image_url: "",
    price_per_day: "",
    location: "",
  });

  function handleLocateMe() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const city =
            data.address?.village ||
            data.address?.town ||
            data.address?.city ||
            data.address?.county ||
            data.address?.district ||
            "Local Village";
          const state = data.address?.state ? `, ${data.address.state}` : "";
          const locationString = `${city}${state}`;

          setForm((prev) => ({ ...prev, location: locationString }));
          toast.success(`Location detected: ${locationString}`);
        } catch {
          setForm((prev) => ({
            ...prev,
            location: `Lat ${pos.coords.latitude.toFixed(2)}, Lon ${pos.coords.longitude.toFixed(2)}`,
          }));
          toast.success("Coordinates captured!");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error("Unable to get current location. Please type manually.");
      },
      { timeout: 10000 }
    );
  }

  function handleImageFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setForm((prev) => ({ ...prev, image_url: dataUrl }));
      toast.success("Image file attached!");
    };
    reader.readAsDataURL(file);
  }

  const { data: equipmentList = [] } = useQuery<EquipmentItem[]>({
    queryKey: ["owner-equipment"],
    queryFn: async () => {
      const { data, error } = await apiRequest<DjangoEquipment[]>("/equipment/");
      if (error || !data) return [];
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: null,
        image_url: item.image_url || null,
        price_per_day: Number(item.price_per_day),
        location: item.location || null,
        is_available: item.is_available,
      }));
    },
  });

  const { data: bookingsList = [] } = useQuery<BookingItem[]>({
    queryKey: ["owner-bookings"],
    queryFn: async () => {
      const { data, error } = await apiRequest<DjangoBooking[]>("/bookings/");
      if (error || !data) return [];
      return data.map((row) => ({
        id: row.id,
        equipment_name: row.equipment_detail?.name || "Farm Machinery",
        farmer_name: row.farmer_detail?.full_name || row.farmer_detail?.email || "Farmer",
        start_date: row.start_date,
        end_date: row.end_date,
        total_price: Number(row.total_price),
        status: row.status as BookingItem["status"],
        created_at: row.start_date,
      }));
    },
  });

  const totalEquipmentCount = equipmentList.length;
  const pendingBookingsCount = bookingsList.filter((b) => b.status === "pending").length;
  const todayRevenue = bookingsList
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + b.total_price, 0);

  async function handleAddEquipment(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price_per_day) {
      toast.error("Equipment Name and Price per day are required.");
      return;
    }

    setSaving(true);
    const { error } = await apiRequest("/equipment/", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        image_url: form.image_url || null,
        price_per_day: Number(form.price_per_day),
        location: form.location,
      }),
    });
    setSaving(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(`${form.name} listed successfully!`);
    setForm({
      name: "",
      category: "Tractor",
      description: "",
      image_url: "",
      price_per_day: "",
      location: "",
    });
    setAddModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["owner-equipment"] });
  }

  async function updateBookingStatus(id: string, status: "confirmed" | "rejected") {
    const { error } = await apiRequest(`/bookings/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(`Booking ${status === "confirmed" ? "accepted" : "declined"}.`);
    queryClient.invalidateQueries({ queryKey: ["owner-bookings"] });
  }

  async function handleDeleteEquipment(id: string) {
    const { error } = await apiRequest(`/equipment/${id}/`, {
      method: "DELETE",
    });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Equipment listing removed.");
    queryClient.invalidateQueries({ queryKey: ["owner-equipment"] });
  }

  async function handleSignOut() {
    clearAuthTokens();
    window.dispatchEvent(new Event("auth-state-changed"));
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-3xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
            <div className="mb-4 border-b border-gray-200/60 pb-4 px-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-green-600 text-white shadow-sm">
                  <Tractor className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm">Owner Console</h3>
                  <p className="text-[10px] text-gray-500">Equipment Partner</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard Overview
              </button>

              <button
                onClick={() => setActiveTab("equipment")}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-xs font-semibold transition-all ${
                  activeTab === "equipment"
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Tractor className="h-4 w-4" /> My Equipment
                </span>
                <Badge
                  className={`rounded-full border-0 text-[10px] ${
                    activeTab === "equipment"
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {totalEquipmentCount}
                </Badge>
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-xs font-semibold transition-all ${
                  activeTab === "bookings"
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <CalendarCheck className="h-4 w-4" /> Booking Requests
                </span>
                {pendingBookingsCount > 0 && (
                  <Badge className="rounded-full bg-amber-500 text-white border-0 text-[10px]">
                    {pendingBookingsCount}
                  </Badge>
                )}
              </button>

              <button
                onClick={() => setActiveTab("revenue")}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold transition-all ${
                  activeTab === "revenue"
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <IndianRupee className="h-4 w-4" /> Daily Revenue
              </button>
            </nav>

            <div className="mt-8 border-t border-gray-200/60 pt-4 px-2">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </aside>

          <section className="space-y-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Total Equipment
                      </span>
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-100 text-green-700">
                        <Tractor className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-extrabold text-gray-900">
                      {totalEquipmentCount}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">Active listed machinery</p>
                  </Card>

                  <Card className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Pending Requests
                      </span>
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                        <Clock className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-extrabold text-amber-600">
                      {pendingBookingsCount}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">Awaiting your approval</p>
                  </Card>

                  <Card className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Total Revenue
                      </span>
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <TrendingUp className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-extrabold text-emerald-700">
                      ₹{todayRevenue.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">Confirmed booking earnings</p>
                  </Card>
                </div>
              </div>
            )}

            {(activeTab === "dashboard" || activeTab === "equipment") && (
              <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Equipment Listings</h3>
                    <p className="text-xs text-gray-500">
                      Manage equipment availability and daily rates.
                    </p>
                  </div>
                  <Button
                    onClick={() => setAddModalOpen(true)}
                    className="rounded-2xl bg-green-600 px-4 text-xs font-bold text-white shadow-md shadow-green-200 hover:bg-green-700"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Add Equipment
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {equipmentList.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-gray-400">
                      No equipment listed yet. Click "Add Equipment" to list your first machinery.
                    </div>
                  ) : (
                    equipmentList.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px]">
                            {item.category}
                          </Badge>
                          <Badge
                            className={`rounded-full text-[10px] ${
                              item.is_available
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {item.is_available ? "Available" : "Booked"}
                          </Badge>
                        </div>
                        <h4 className="mt-2 font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="mt-1 text-xs font-extrabold text-green-700">
                          ₹{item.price_per_day} / day
                        </p>
                        <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-200/60">
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {item.location || "Local Village"}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteEquipment(item.id)}
                            className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}

            {(activeTab === "dashboard" || activeTab === "bookings") && (
              <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Booking Requests</h3>
                    <p className="text-xs text-gray-500">
                      Approve or decline rental booking requests from farmers.
                    </p>
                  </div>
                </div>

                {bookingsList.length === 0 ? (
                  <p className="py-8 text-center text-xs text-gray-400">
                    No booking requests received yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Equipment</TableHead>
                          <TableHead className="text-xs">Farmer</TableHead>
                          <TableHead className="text-xs">Dates</TableHead>
                          <TableHead className="text-xs">Total</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                          <TableHead className="text-right text-xs">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookingsList.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-semibold text-xs text-gray-900">
                              {b.equipment_name}
                            </TableCell>
                            <TableCell className="text-xs text-gray-600">
                              {b.farmer_name}
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">
                              {b.start_date}
                            </TableCell>
                            <TableCell className="font-bold text-xs text-green-700">
                              ₹{b.total_price}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="rounded-full text-[10px] capitalize"
                              >
                                {b.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              {b.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateBookingStatus(b.id, "confirmed")}
                                    className="h-8 rounded-xl bg-green-600 px-3 text-xs font-bold text-white hover:bg-green-700"
                                  >
                                    <Check className="h-3.5 w-3.5 mr-1" /> Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateBookingStatus(b.id, "rejected")}
                                    className="h-8 rounded-xl border-gray-200 px-3 text-xs font-bold text-red-600 hover:bg-red-50"
                                  >
                                    <X className="h-3.5 w-3.5 mr-1" /> Decline
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            )}
          </section>
        </div>
      </main>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md rounded-3xl border-gray-100 bg-white p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900">
              List New Equipment
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Fill in details to make your machinery available for rent to local farmers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEquipment} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Equipment Name *</Label>
              <Input
                required
                placeholder="e.g. Mahindra 575 DI Tractor"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger className="h-11 rounded-2xl border-gray-200 bg-white text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100 bg-white shadow-xl max-h-60">
                    <SelectItem value="Tractor">🚜 Tractor</SelectItem>
                    <SelectItem value="Harvester">🌾 Combine Harvester</SelectItem>
                    <SelectItem value="Sprayer">💦 Tractor Sprayer</SelectItem>
                    <SelectItem value="Drone">🛸 Agriculture Drone</SelectItem>
                    <SelectItem value="Labours">👨‍🌾 Farm Labour / Crew</SelectItem>
                    <SelectItem value="Cultivator">🌱 Tillage & Rotavator</SelectItem>
                    <SelectItem value="Seeder">🌾 Seeder & Planter</SelectItem>
                    <SelectItem value="Irrigation">💧 Irrigation & Pumps</SelectItem>
                    <SelectItem value="Other">🛠️ Other Machinery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Price per Day (₹) *</Label>
                <Input
                  type="number"
                  required
                  placeholder="1500"
                  value={form.price_per_day}
                  onChange={(e) => setForm({ ...form, price_per_day: e.target.value })}
                  className="h-11 rounded-2xl"
                />
              </div>
            </div>

            {/* Equipment Image File Browse & Preview */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Equipment Image</Label>
              {form.image_url ? (
                <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={form.image_url}
                    alt="Equipment Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image_url: "" })}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-3 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 hover:border-gray-400">
                    <Upload className="h-4 w-4 text-green-600" />
                    <span>Browse Image File from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <Input
                    placeholder="Or paste image URL (https://...)"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
              )}
            </div>

            {/* Location with Locate Me */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-gray-700">Location / Village</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="h-6 px-2 text-[11px] text-green-700 hover:bg-green-50 font-semibold"
                >
                  {isLocating ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Navigation className="mr-1 h-3 w-3" />
                  )}
                  Locate Me
                </Button>
              </div>
              <div className="relative">
                <Input
                  placeholder="e.g. Raipur, Chhattisgarh"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="h-11 rounded-2xl pr-9"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="h-12 w-full rounded-2xl bg-green-600 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700"
            >
              {saving ? "Publishing Listing..." : "Publish Listing"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
