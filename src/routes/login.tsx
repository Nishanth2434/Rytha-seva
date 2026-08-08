import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Leaf, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2, XCircle, Mail, ShieldCheck, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest, setAuthTokens } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { sendEmail } from "@/lib/email";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | KrishiMitra AI" },
      {
        name: "description",
        content: "Sign in or create your KrishiMitra AI farmer account using Email or Google.",
      },
      { property: "og:title", content: "Sign in | KrishiMitra AI" },
      { property: "og:description", content: "Sign in or create a free KrishiMitra AI account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { data, error } = await apiRequest<{ access: string; refresh: string }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (error || !data) {
      toast.error(error || "Invalid credentials. Please try again.");
      return;
    }

    setAuthTokens(data.access, data.refresh);
    window.dispatchEvent(new Event("auth-state-changed"));
    toast.success("Welcome back!");
    navigate({ to: "/", replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please check your password verification.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    // Call standard registration endpoint
    const { data: regData, error: regError } = await apiRequest("/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        is_owner: false,
      }),
    });

    if (regError) {
      setLoading(false);
      toast.error(regError || "Registration failed. Please try again.");
      return;
    }

    // Auto-login after successful registration
    const { data: loginData, error: loginError } = await apiRequest<{ access: string; refresh: string }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (loginError || !loginData) {
      toast.error("Account created, but automatic login failed. Please sign in.");
      // Could switch to signin tab, but let's just let them click it
      return;
    }

    setAuthTokens(loginData.access, loginData.refresh);
    window.dispatchEvent(new Event("auth-state-changed"));

    // Trigger EmailJS welcome notification
    sendEmail({
      to_name: fullName || email,
      to_email: email,
      subject: "Welcome to KrishiMitra AI!",
      message: `Hello ${fullName || "Farmer"}, welcome to KrishiMitra AI! Your account is now active.`,
    });

    toast.success("Account created successfully! Welcome to KrishiMitra AI!");
    navigate({ to: "/", replace: true });
  }

  // ─── Main Login / Sign-Up View ──────────────────────────────────────────────
  return (
    <main className="grid min-h-screen place-items-center bg-white px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-6 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-200">
              <Leaf className="h-6 w-6" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Krishi<span className="text-green-600">Mitra</span> AI
            </span>
          </Link>
          <p className="mt-2 text-xs text-gray-500">Smart Farming Companion for Indian Farmers</p>
        </div>

        <Card className="rounded-3xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-100">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Sign in to manage your bookings, listings and advisories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-gray-100 p-1">
                <TabsTrigger value="signin" className="rounded-xl text-xs font-semibold">
                  Sign in
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl text-xs font-semibold">
                  Create account
                </TabsTrigger>
              </TabsList>

              {/* Sign In Form */}
              <TabsContent value="signin">
                <form onSubmit={signIn} className="space-y-4 pt-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="e1" className="text-xs font-semibold text-gray-700">
                      Email or Username
                    </Label>
                    <Input
                      id="e1"
                      type="text"
                      required
                      placeholder="farmer@example.com or username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-2xl border-gray-200 bg-white text-sm shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="p1" className="text-xs font-semibold text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="p1"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 rounded-2xl border-gray-200 bg-white pr-10 text-sm shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl bg-green-600 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup">
                <form onSubmit={signUp} className="space-y-4 pt-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="n2" className="text-xs font-semibold text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="n2"
                      required
                      placeholder="Ramesh Patil"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 rounded-2xl border-gray-200 bg-white text-sm shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="e2" className="text-xs font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="e2"
                      type="email"
                      required
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-2xl border-gray-200 bg-white text-sm shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="p2" className="text-xs font-semibold text-gray-700">
                      Password (min 8 characters)
                    </Label>
                    <div className="relative">
                      <Input
                        id="p2"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 rounded-2xl border-gray-200 bg-white pr-10 text-sm shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cp2" className="text-xs font-semibold text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="cp2"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={8}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-11 rounded-2xl border-gray-200 bg-white pr-10 text-sm shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {confirmPassword.length > 0 && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                        {password === confirmPassword ? (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Passwords match
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-500">
                            <XCircle className="h-3.5 w-3.5" /> Passwords do not match
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || (confirmPassword.length > 0 && password !== confirmPassword)}
                    className="h-12 w-full rounded-2xl bg-green-600 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Account
                  </Button>

                  <p className="text-center text-[10px] text-transparent">
                    {/* Placeholder to keep spacing */}
                    &nbsp;
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-xs text-gray-500">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-green-600 font-medium"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
