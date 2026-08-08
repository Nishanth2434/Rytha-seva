import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, Search, ExternalLink, Loader2 } from "lucide-react";

/** Verified scheme registry — only these entries exist in our scheme portal. */
export const SCHEME_REGISTRY = [
  { name: "PM-KISAN Samman Nidhi", host: "pmkisan.gov.in", url: "https://pmkisan.gov.in/" },
  { name: "PM Fasal Bima Yojana (PMFBY)", host: "pmfby.gov.in", url: "https://pmfby.gov.in/" },
  { name: "myScheme National Portal", host: "www.myscheme.gov.in", url: "https://www.myscheme.gov.in/" },
  { name: "myScheme National Portal", host: "myscheme.gov.in", url: "https://www.myscheme.gov.in/" },
  { name: "Kisan Credit Card (KCC)", host: "kisancreditcard.gov.in", url: "https://kisancreditcard.gov.in/" },
  { name: "SMAM — Agri Mechanization", host: "agrimachinery.nic.in", url: "https://agrimachinery.nic.in/" },
  { name: "Soil Health Card", host: "soilhealth.dac.gov.in", url: "https://soilhealth.dac.gov.in/" },
  { name: "e-NAM National Agriculture Market", host: "enam.gov.in", url: "https://enam.gov.in/" },
  { name: "Kisan Rin Portal", host: "krp.dacnet.nic.in", url: "https://krp.dacnet.nic.in/" },
  { name: "Agriculture Infrastructure Fund", host: "agriinfra.dac.gov.in", url: "https://agriinfra.dac.gov.in/" },
] as const;

type Result =
  | { status: "verified"; scheme: string; url: string; host: string }
  | { status: "error"; errors: string[]; host?: string };

function verify(raw: string): Result {
  const errors: string[] = [];
  const value = raw.trim();

  if (!value) return { status: "error", errors: ["Please paste a scheme URL to verify."] };

  let parsed: URL;
  try {
    parsed = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return { status: "error", errors: ["Invalid URL format — it could not be parsed as a web address."] };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    errors.push(`Unsupported protocol "${parsed.protocol}" — only http/https links are accepted.`);
  }
  if (parsed.protocol === "http:") {
    errors.push("Insecure link (http). Official scheme portals always use https.");
  }

  const host = parsed.hostname.toLowerCase();
  const match = SCHEME_REGISTRY.find((s) => s.host === host);

  if (!match) {
    errors.push(`Domain "${host}" is not present in the KrishiMitra verified scheme portal registry.`);
    if (!host.endsWith(".gov.in") && !host.endsWith(".nic.in")) {
      errors.push("Not a government domain (.gov.in / .nic.in) — high risk of a fraudulent scheme page.");
    }
  }

  if (errors.length > 0) return { status: "error", errors, host };
  return { status: "verified", scheme: match!.name, url: parsed.toString(), host };
}

export function SchemeUrlVerifier() {
  const [value, setValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(verify(value));
      setChecking(false);
    }, 450);
  };

  return (
    <Card className="rounded-3xl border border-green-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <h3 className="text-base font-bold text-gray-900">Verify a Scheme Link</h3>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Paste any scheme or subsidy URL. We check it against our verified scheme portal registry before
        letting you open it.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          type="text"
          inputMode="url"
          maxLength={300}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setResult(null);
          }}
          placeholder="https://pmkisan.gov.in/"
          aria-label="Scheme URL"
          className="rounded-2xl"
        />
        <Button type="submit" disabled={checking} className="rounded-2xl sm:w-40">
          {checking ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-1 h-4 w-4" />
          )}
          {checking ? "Checking…" : "Verify"}
        </Button>
      </form>

      {result?.status === "verified" && (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-0 bg-green-600 text-[10px] font-bold uppercase text-white">
              Verified · Yes
            </Badge>
            <span className="text-sm font-semibold text-green-900">{result.scheme}</span>
          </div>
          <p className="mt-1 text-xs text-green-800">
            {result.host} is listed in the official KrishiMitra scheme portal registry.
          </p>
          <Button asChild size="sm" className="mt-3 rounded-2xl">
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              Open scheme page <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      )}

      {result?.status === "error" && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <Badge className="border-0 bg-red-600 text-[10px] font-bold uppercase text-white">
              Not Verified
            </Badge>
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-800">
            {result.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] font-semibold text-red-700">
            Opening is blocked for your safety. Only links from our verified registry can be opened.
          </p>
          <Button size="sm" disabled className="mt-3 rounded-2xl">
            Open scheme page
          </Button>
        </div>
      )}

      <p className="mt-3 text-[10px] text-gray-400">
        Registry: pmkisan.gov.in · pmfby.gov.in · myscheme.gov.in · enam.gov.in · soilhealth.dac.gov.in ·
        agrimachinery.nic.in · kisancreditcard.gov.in · agriinfra.dac.gov.in · krp.dacnet.nic.in
      </p>
    </Card>
  );
}
