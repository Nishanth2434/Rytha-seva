import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Phone,
  MapPin,
  Home,
  Edit,
  Tractor,
  CalendarCheck,
  LogOut,
  CheckCircle2,
  Plus,
  Clock,
  Navigation,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageShell } from "@/components/site/PageShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest, clearAuthTokens } from "@/lib/api-client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | KrishiMitra AI" },
      {
        name: "description",
        content:
          "Manage your farmer profile, bookings and equipment owner application status on KrishiMitra AI.",
      },
      { property: "og:title", content: "My Profile | KrishiMitra AI" },
      { property: "og:description", content: "Manage your farmer profile and bookings." },
    ],
  }),
  component: ProfilePage,
});

interface BookingItem {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_price: number | string;
  equipment_detail?: { name: string } | null;
}

interface DjangoProfile {
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
  owner_status: string;
}

function ProfilePage() {
  const { user } = Route.useRouteContext() as { user: DjangoProfile };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    village: "",
    district: "",
    avatar_url: "",
  });

  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [ownerSubmitting, setOwnerSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [ownerForm, setOwnerForm] = useState({
    equipment_name: "",
    category: "Tractor",
    photos: "",
    price_per_day: "",
    location: "",
    is_available: true,
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

          setOwnerForm((prev) => ({ ...prev, location: locationString }));
          toast.success(`Location detected: ${locationString}`);
        } catch {
          setOwnerForm((prev) => ({
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
      setOwnerForm((prev) => ({ ...prev, photos: dataUrl }));
      toast.success("Image file attached!");
    };
    reader.readAsDataURL(file);
  }

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await apiRequest<DjangoProfile>("/auth/me/");
      if (error || !data) throw new Error(error || "Failed to load profile");
      return data;
    },
    initialData: user,
  });

  const { data: bookings = [] } = useQuery<BookingItem[]>({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const { data, error } = await apiRequest<BookingItem[]>("/bookings/");
      if (error || !data) return [];
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        village: profile.village ?? "",
        district: profile.district ?? profile.state ?? "",
        avatar_url: profile.avatar_url ?? "",
      });
    }
  }, [profile]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    const { error } = await apiRequest("/auth/me/", {
      method: "PUT",
      body: JSON.stringify({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        village: profileForm.village,
        district: profileForm.district,
      }),
    });
    setProfileSaving(false);

    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Profile updated successfully!");
    setEditProfileOpen(false);
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  }

  async function handleOwnerApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!ownerForm.equipment_name || !ownerForm.price_per_day) {
      toast.error("Equipment Name and Price are required.");
      return;
    }

    setOwnerSubmitting(true);
    try {
      const { error: eqError } = await apiRequest("/owner-requests/", {
        method: "POST",
        body: JSON.stringify({
          equipment_name: ownerForm.equipment_name,
          category: ownerForm.category,
          photos: ownerForm.photos || null,
          price: Number(ownerForm.price_per_day),
          location: ownerForm.location || profileForm.village || "Local Village",
        }),
      });

      if (eqError) {
        toast.error(eqError);
        setOwnerSubmitting(false);
        return;
      }

      toast.success("Owner Application Submitted!", {
        description: "Your request is now pending admin approval.",
      });

      setOwnerModalOpen(false);
      setOwnerForm({
        equipment_name: "",
        category: "Tractor",
        photos: "",
        price_per_day: "",
        location: "",
        is_available: true,
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch {
      toast.error("Failed to submit owner application");
    } finally {
      setOwnerSubmitting(false);
    }
  }

  async function handleSignOut() {
    clearAuthTokens();
    window.dispatchEvent(new Event("auth-state-changed"));
    navigate({ to: "/login", replace: true });
  }

  const isApprovedOwner = Boolean(profile?.is_owner);
  const isPendingOwner = !isApprovedOwner && profile?.owner_status === "pending";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageShell
        eyebrow="Farmer Account"
        title="My Profile"
        description="Manage your personal details, equipment bookings, and owner application status."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-green-100 text-green-700 font-extrabold text-2xl overflow-hidden shadow-sm">
                    {profileForm.avatar_url ? (
                      <img
                        src={profileForm.avatar_url}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (profileForm.full_name?.[0] || profile?.email?.[0] || "F").toUpperCase()
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-extrabold text-gray-900">
                        {profileForm.full_name || profile?.username || "Farmer Profile"}
                      </h2>
                      <Badge
                        className={`rounded-full border-0 text-xs ${
                          isApprovedOwner
                            ? "bg-green-100 text-green-800"
                            : isPendingOwner
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isApprovedOwner
                          ? "Equipment Owner"
                          : isPendingOwner
                            ? "Owner (Pending)"
                            : "Farmer"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{profile?.email}</p>
                  </div>
                </div>

                <Button
                  onClick={() => setEditProfileOpen(true)}
                  variant="outline"
                  className="rounded-2xl border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50/60 p-4 border border-gray-100">
                  <Phone className="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profileForm.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50/60 p-4 border border-gray-100">
                  <Home className="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Village
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profileForm.village || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50/60 p-4 border border-gray-100">
                  <MapPin className="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      District
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {profileForm.district || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50/60 p-4 border border-gray-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Account Status
                    </p>
                    <p className="text-sm font-semibold text-green-700">Verified Account</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-extrabold text-gray-900">My Bookings</h3>
                </div>
                <Badge variant="outline" className="border-gray-200 text-xs">
                  {bookings.length} Total
                </Badge>
              </div>

              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <p className="p-4 text-center text-xs text-gray-400">
                    No equipment bookings made yet.
                  </p>
                ) : (
                  bookings.map((b: BookingItem) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4"
                    >
                      <div>
                        <p className="font-bold text-gray-900">
                          {b.equipment_detail?.name || "Machinery Rental"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {b.start_date} → {b.end_date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-green-700">
                          ₹{Number(b.total_price).toLocaleString("en-IN")}
                        </p>
                        <Badge variant="secondary" className="rounded-full text-[10px] capitalize">
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-50/60 to-white p-6 shadow-sm">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-2">
                  <Tractor className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-lg font-bold text-gray-900">Equipment Owner</CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-600 mt-1">
                  Rent out your idle tractors, harvesters or sprayers and earn extra income.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {isApprovedOwner ? (
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100 text-xs text-emerald-800">
                      <p className="font-bold">✅ Approved Owner</p>
                      <p className="mt-0.5">Your owner console is fully active.</p>
                    </div>
                    <Button
                      asChild
                      className="w-full rounded-2xl bg-green-600 font-bold text-white hover:bg-green-700 shadow-md shadow-green-200"
                    >
                      <Link to="/owner/dashboard">
                        <Tractor className="mr-2 h-4 w-4" /> Open Owner Dashboard
                      </Link>
                    </Button>
                  </div>
                ) : isPendingOwner ? (
                  <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900">
                    <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
                      <Clock className="h-4 w-4" /> Application Pending Approval
                    </div>
                    Your equipment owner application has been submitted and is pending Admin approval.
                  </div>
                ) : (
                  <Button
                    onClick={() => setOwnerModalOpen(true)}
                    className="w-full rounded-2xl bg-green-600 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Become an Equipment Owner
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageShell>

      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-md rounded-3xl border-gray-100 bg-white p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900">Edit Profile</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Update your personal details for personalized advisories.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Full Name</Label>
              <Input
                placeholder="e.g. Ramesh Patil"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Phone Number</Label>
              <Input
                placeholder="+91 98765 43210"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Village</Label>
                <Input
                  placeholder="e.g. Khed"
                  value={profileForm.village}
                  onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                  className="h-11 rounded-2xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">District</Label>
                <Input
                  placeholder="e.g. Nashik"
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                  className="h-11 rounded-2xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={profileSaving}
              className="h-12 w-full rounded-2xl bg-green-600 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700"
            >
              {profileSaving ? "Saving Changes..." : "Save Profile"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={ownerModalOpen} onOpenChange={setOwnerModalOpen}>
        <DialogContent className="max-w-md rounded-3xl border-gray-100 bg-white p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-gray-900">
              Equipment Owner Application
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Provide details of the machinery you wish to list.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOwnerApplication} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Equipment Name *</Label>
              <Input
                required
                placeholder="e.g. Mahindra 575 DI Tractor"
                value={ownerForm.equipment_name}
                onChange={(e) => setOwnerForm({ ...ownerForm, equipment_name: e.target.value })}
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">Category *</Label>
                <Select
                  value={ownerForm.category}
                  onValueChange={(val) => setOwnerForm({ ...ownerForm, category: val })}
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
                  placeholder="1800"
                  value={ownerForm.price_per_day}
                  onChange={(e) => setOwnerForm({ ...ownerForm, price_per_day: e.target.value })}
                  className="h-11 rounded-2xl"
                />
              </div>
            </div>

            {/* Equipment Image File Browse & Preview */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Equipment Image</Label>
              {ownerForm.photos ? (
                <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={ownerForm.photos}
                    alt="Equipment Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setOwnerForm({ ...ownerForm, photos: "" })}
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
                    value={ownerForm.photos}
                    onChange={(e) => setOwnerForm({ ...ownerForm, photos: e.target.value })}
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
                  placeholder="e.g. Khed, Nashik"
                  value={ownerForm.location}
                  onChange={(e) => setOwnerForm({ ...ownerForm, location: e.target.value })}
                  className="h-11 rounded-2xl pr-9"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={ownerSubmitting}
              className="h-12 w-full rounded-2xl bg-green-600 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700"
            >
              {ownerSubmitting ? "Submitting Application..." : "Submit Owner Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
