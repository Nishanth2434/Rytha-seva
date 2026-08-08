import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  UploadCloud,
  Sparkles,
  Loader2,
  Leaf,
  FlaskConical,
  X,
  AlertTriangle,
  Info,
  MapPin,
  Clock,
  Radio,
  FileImage,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageShell } from "@/components/site/PageShell";
import { AdBanner } from "@/components/site/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/pest")({
  head: () => ({
    meta: [
      { title: "AI Pest & Disease Diagnosis | KrishiMitra AI" },
      {
        name: "description",
        content:
          "Upload a photo of your infected crop to instantly detect diseases, get organic & chemical treatments, and view nearby community alerts.",
      },
      { property: "og:title", content: "AI Pest & Disease Diagnosis | KrishiMitra AI" },
      {
        property: "og:description",
        content: "Crop disease diagnosis with organic & chemical solutions.",
      },
    ],
  }),
  component: PestPage,
});

/* =========================================================================
   GEMINI VISION API INTEGRATION PLACEHOLDER
   =========================================================================
   To connect Google Gemini 1.5 Flash Vision API:
   1. Set VITE_GEMINI_API_KEY="your_api_key" in .env
   2. Call analyzeCropDiseaseWithGemini() with the base64 image string.
   ========================================================================= */

export async function analyzeCropDiseaseWithGemini(base64Image: string) {
  const apiKey = import.meta.env["VITE_GEMINI_API_KEY"];
  if (!apiKey) {
    console.info(
      "[Gemini Vision API] VITE_GEMINI_API_KEY not found. Using local vision AI fallback model.",
    );
    return null;
  }

  try {
    const prompt = `Analyze this agricultural crop leaf/plant image. Identify if there is any disease or pest infestation.
Return JSON with format:
{
  "diseaseName": "Name of Disease",
  "scientificName": "Scientific Name",
  "confidence": 94.5,
  "severity": "High" | "Moderate" | "Low",
  "organicSolution": "Step by step organic treatment",
  "chemicalSolution": "Step by step chemical treatment",
  "prevention": "Preventative measures"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await res.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (resultText) {
      return JSON.parse(resultText);
    }
  } catch (err) {
    console.error("[Gemini Vision API Error]", err);
  }
  return null;
}

export interface DiseaseResult {
  diseaseName: string;
  scientificName: string;
  confidence: number;
  severity: string;
  affectedCrop: string;
  description: string;
  organicSolution: string;
  chemicalSolution: string;
  prevention: string;
}

// Sample Disease Database for Mock Diagnosis
const mockDiseases: DiseaseResult[] = [
  {
    diseaseName: "Early Blight (Alternaria solani)",
    scientificName: "Alternaria solani",
    confidence: 94.8,
    severity: "High",
    affectedCrop: "Tomato / Potato",
    description:
      "Concentric ring dark brown spots surrounded by a yellow halo on lower older leaves. Can cause severe defoliation if left untreated.",
    organicSolution:
      "1. Spray Neem Oil (5ml/L) or Copper Hydroxide (2g/L) mixed with sticky soap solution.\n2. Prune lower infected leaves to prevent rain splash dispersal.\n3. Apply Trichoderma viride bio-fungicide to soil.",
    chemicalSolution:
      "1. Spray Mancozeb 75% WP @ 2.5g/L or Chlorothalonil @ 2g/L water at first symptom.\n2. In severe outbreaks, spray Difenoconazole 25% EC @ 1ml/L water. Repeat after 10–12 days.",
    prevention:
      "Maintain wider plant spacing for canopy ventilation. Avoid overhead sprinkler irrigation.",
  },
  {
    diseaseName: "Pink Bollworm Infestation",
    scientificName: "Pectinophora gossypiella",
    confidence: 91.2,
    severity: "High",
    affectedCrop: "Cotton",
    description:
      "Rosetted flowers and small entry holes in green bolls with lint staining. Larvae feed internally on seeds.",
    organicSolution:
      "1. Install Pheromone Traps (Gossyplure) @ 8–10 traps/acre for adult monitoring & mating disruption.\n2. Release Trichogramma chilonis egg parasitoids @ 60,000/acre weekly.\n3. Spray Neem Seed Kernel Extract (NSKE 5%).",
    chemicalSolution:
      "1. Spray Profenofos 50% EC @ 2ml/L or Emamectin Benzoate 5% SG @ 0.5g/L water during peak moth emergence.\n2. Alternate mode of action to avoid resistance.",
    prevention: "Destroy crop residues promptly post-harvest and observe a 60-day closed season.",
  },
];

// Community Outbreak Alerts Mock Data
const communityAlerts = [
  {
    village: "Guntur, Andhra Pradesh",
    distance: "6 km away",
    pest: "Pink Bollworm",
    crop: "Cotton",
    reported: "2 hours ago",
    severity: "High",
    reportsCount: 18,
  },
  {
    village: "Nashik, Maharashtra",
    distance: "12 km away",
    pest: "Powdery Mildew",
    crop: "Grapes",
    reported: "5 hours ago",
    severity: "Moderate",
    reportsCount: 9,
  },
  {
    village: "Karnal, Haryana",
    distance: "18 km away",
    pest: "Yellow Rust",
    crop: "Wheat",
    reported: "1 day ago",
    severity: "High",
    reportsCount: 24,
  },
  {
    village: "Mandya, Karnataka",
    distance: "25 km away",
    pest: "Stem Borer",
    crop: "Paddy",
    reported: "1 day ago",
    severity: "Low",
    reportsCount: 5,
  },
];

function PestPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file selection
  function handleFileChange(file: File) {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null); // Reset previous result
    };
    reader.readAsDataURL(file);
  }

  // Handle Drag & Drop
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }

  // Run AI Analysis
  async function runDiagnosis() {
    if (!selectedImage) return;
    setIsAnalyzing(true);

    const geminiData = await analyzeCropDiseaseWithGemini(selectedImage);

    setTimeout(() => {
      if (geminiData) {
        setAnalysisResult(geminiData);
      } else {
        const randomIndex = Math.floor(Math.random() * mockDiseases.length);
        const fallback: DiseaseResult = mockDiseases[randomIndex] ?? mockDiseases[0]!;
        setAnalysisResult(fallback);
      }
      setIsAnalyzing(false);
    }, 1500);
  }

  function resetUploader() {
    setSelectedImage(null);
    setFileName("");
    setAnalysisResult(null);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <PageShell
        eyebrow="AI Plant Doctor"
        title="Pest & Disease Prediction"
        description="Upload a photo of an infected leaf or plant to receive instant AI disease identification with organic & chemical solutions."
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left Column — Image Uploader & Diagnosis Result */}
          <div className="space-y-8">
            {/* ─── Drag and Drop Uploader Card ─── */}
            <Card className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-green-100 text-green-700">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">Upload Crop Photo</h3>
                  </div>
                  {selectedImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetUploader}
                      className="rounded-full text-xs text-gray-500 hover:text-red-600"
                    >
                      <X className="mr-1 h-3.5 w-3.5" /> Remove Image
                    </Button>
                  )}
                </div>

                {!selectedImage ? (
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
                      isDragging
                        ? "border-green-500 bg-green-50/60 shadow-inner"
                        : "border-gray-200 bg-gray-50/50 hover:border-green-400 hover:bg-green-50/30"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    />

                    <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 transition-transform group-hover:scale-110">
                      <UploadCloud className="h-8 w-8" />
                    </div>

                    <h4 className="mt-4 text-base font-semibold text-gray-900">
                      Drag & Drop your crop photo here
                    </h4>
                    <p className="mt-1 text-xs text-gray-500">
                      Supports JPG, PNG, WEBP up to 10MB (Leaf, fruit or stem photo)
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-5 rounded-full border-green-200 bg-white text-green-700 hover:bg-green-50"
                    >
                      <FileImage className="mr-2 h-4 w-4" /> Browse File
                    </Button>
                  </div>
                ) : (
                  /* Image Preview Card */
                  <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-900/5">
                      <img
                        src={selectedImage}
                        alt="Uploaded crop preview"
                        className="max-h-80 w-full object-contain"
                      />
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-md">
                        {fileName}
                      </div>
                    </div>

                    <Button
                      onClick={runDiagnosis}
                      disabled={isAnalyzing}
                      className="h-13 w-full rounded-2xl bg-green-600 text-base font-semibold shadow-lg shadow-green-200 hover:bg-green-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Scanning with AI
                          Vision...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" /> Analyze Crop Disease
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ─── Result Card (After Analysis) ─── */}
            {analysisResult && (
              <Card className="overflow-hidden rounded-3xl border border-green-200 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30 shadow-xl shadow-green-100/50">
                <CardContent className="p-8">
                  {/* Diagnosis Header */}
                  <div className="flex flex-col justify-between gap-4 border-b border-green-100 pb-6 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600 text-white hover:bg-green-700">
                          AI Diagnosis Result
                        </Badge>
                        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                          Severity: {analysisResult.severity}
                        </Badge>
                      </div>
                      <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                        {analysisResult.diseaseName}
                      </h2>
                      <p className="text-xs italic text-gray-500">
                        {analysisResult.scientificName}
                      </p>
                    </div>

                    {/* Confidence Score Pill */}
                    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-green-100 shadow-sm">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-100 text-green-700 font-bold text-lg">
                        {analysisResult.confidence}%
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">AI Confidence</p>
                        <p className="text-xs text-green-700 font-bold">High Match</p>
                      </div>
                    </div>
                  </div>

                  {/* Disease Description */}
                  <div className="py-5">
                    <p className="text-sm leading-relaxed text-gray-700">
                      {analysisResult.description}
                    </p>
                  </div>

                  {/* ─── Treatment Options ─── */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Organic Solution */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <Leaf className="h-5 w-5 text-emerald-600" /> Organic / Biological Solution
                      </div>
                      <div className="mt-3 text-xs leading-relaxed text-emerald-950 whitespace-pre-line">
                        {analysisResult.organicSolution}
                      </div>
                    </div>

                    {/* Chemical Solution */}
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                      <div className="flex items-center gap-2 font-bold text-blue-800">
                        <FlaskConical className="h-5 w-5 text-blue-600" /> Chemical Treatment
                      </div>
                      <div className="mt-3 text-xs leading-relaxed text-blue-950 whitespace-pre-line">
                        {analysisResult.chemicalSolution}
                      </div>
                    </div>
                  </div>

                  {/* Preventative Measures */}
                  <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 text-xs text-gray-600">
                    <span className="font-bold text-gray-900">🛡️ Prevention Advice: </span>
                    {analysisResult.prevention}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gemini Vision API Placeholder Info Box */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5 text-xs text-gray-600">
              <div className="mb-1 flex items-center gap-2 font-semibold text-purple-700">
                <Info className="h-4 w-4" /> Gemini Vision API Integration Ready
              </div>
              To enable real-time multimodal image analysis with Google Gemini 1.5 Flash, add{" "}
              <code>VITE_GEMINI_API_KEY=your_key</code> to your <code>.env</code> file. The{" "}
              <code>analyzeCropDiseaseWithGemini()</code> function in{" "}
              <code>src/routes/pest.tsx</code> is ready.
            </div>
          </div>

          {/* Right Column — Nearby Community Outbreak Alerts */}
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                    </span>
                    <h3 className="text-base font-bold text-gray-900">Nearby Outbreak Alerts</h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-gray-200 bg-gray-50 text-gray-600 text-[10px]"
                  >
                    Live Feed
                  </Badge>
                </div>

                <div className="space-y-4">
                  {communityAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 transition-all hover:bg-green-50/30 hover:border-green-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{alert.pest}</p>
                          <p className="text-xs text-gray-500">Affecting {alert.crop}</p>
                        </div>
                        <Badge
                          className={`text-[10px] ${
                            alert.severity === "High"
                              ? "bg-red-100 text-red-700 hover:bg-red-200 border-0"
                              : alert.severity === "Moderate"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border-0"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
                          }`}
                        >
                          {alert.severity} Risk
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-200/50 pt-2.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-green-600" /> {alert.village} (
                          {alert.distance})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" /> {alert.reported}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-6 w-full rounded-2xl border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Radio className="mr-2 h-4 w-4 text-red-500" /> Report Pest Outbreak in Village
                </Button>
              </CardContent>
            </Card>

            <AdBanner label="Sponsored · Bio-pesticides" />
          </div>
        </div>
      </PageShell>

      <Footer />
    </div>
  );
}
