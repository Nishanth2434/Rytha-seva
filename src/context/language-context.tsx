import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LanguageCode = "en" | "kn" | "hi";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_weather: "Weather",
    nav_pest: "Pest AI",
    nav_market: "Market",
    nav_equipment: "Equipment",
    nav_reels: "Reels",
    nav_profile: "Profile",
    nav_signin: "Sign in",
    nav_signout: "Sign out",
    nav_owner_dashboard: "Owner Dashboard",

    // Hero Section
    hero_eyebrow: "AI-Powered Farming",
    hero_title: "AI Powered Farming Assistant",
    hero_desc:
      "Helping farmers make smarter decisions through weather intelligence, pest prediction, market insights and equipment booking.",
    hero_explore_weather: "Explore Weather",
    hero_book_equipment: "Book Equipment",

    // Features Section
    features_eyebrow: "Smart Tools",
    features_title: "Explore Features (Swipe Left to Right)",
    feat_weather_title: "Weather Advisor",
    feat_weather_desc:
      "Hyperlocal 7-day forecasts turned into spray, irrigation and harvest decisions.",
    feat_pest_title: "Pest Alerts",
    feat_pest_desc: "AI-powered outbreak risk scores 10 days ahead tuned to your village and crop.",
    feat_market_title: "Market Analysis",
    feat_market_desc: "Live mandi rates, 7-day price momentum and AI sell-or-hold recommendations.",
    feat_voice_title: "Voice Assistant",
    feat_voice_desc: "Ask anything about your farm in your language — instant AI responses.",
    feat_equipment_title: "Equipment Booking",
    feat_equipment_desc:
      "Rent tractors, harvesters, drones and sprayers from verified owners near you.",

    // General Actions
    watch_reels: "Watch Reels",
    book_now: "Book Now",
    open_tool: "Open",

    // Government Schemes
    schemes_title: "Government Schemes & Subsidies",
    scheme_active: "Active Scheme",
    scheme_subsidy: "Subsidy Scheme",
    scheme_credit: "Credit Scheme",
    scheme_pmkisan_title: "PM-KISAN Samman Nidhi",
    scheme_pmkisan_benefit: "₹6,000/year — 3 installments of ₹2,000 via DBT",
    scheme_pmkisan_desc:
      "Income support for all landholding farmer families. Direct bank transfer every 4 months. Check status at pmkisan.gov.in",
    scheme_pmfby_title: "PM Fasal Bima Yojana (PMFBY)",
    scheme_pmfby_benefit: "Crop Insurance: 2% Kharif, 1.5% Rabi, 5% Commercial",
    scheme_pmfby_desc:
      "Comprehensive crop insurance from pre-sowing to post-harvest. Budget: ₹69,515 Cr. Uses satellite & drone assessments for faster claims.",
    scheme_smam_title: "SMAM — Agri Mechanization",
    scheme_smam_benefit: "40-50% subsidy on tractors, drones, tillers & sprayers",
    scheme_smam_desc:
      "Sub-Mission on Agricultural Mechanization. 50% for SC/ST/small/marginal/women farmers, 40% for others. Supports Custom Hiring Centres.",
    scheme_kcc_title: "Kisan Credit Card (KCC)",
    scheme_kcc_benefit: "Crop loans up to ₹5 lakh at just 4% interest",
    scheme_kcc_desc:
      "Collateral-free up to ₹2 lakh. Apply via any bank branch, Kisan Rin Portal, or e-KCC digital process. Covers crop production & allied activities.",
  },
  kn: {
    // Navigation
    nav_home: "ಮುಖ್ಯ ಪುಟ",
    nav_weather: "ಹವಾಮಾನ",
    nav_pest: "ಕ್ರಿಮಿಕೀಟ ಎಐ",
    nav_market: "ಮಾರುಕಟ್ಟೆ",
    nav_equipment: "ಉಪಕರಣಗಳು",
    nav_reels: "ವೀಡಿಯೊಗಳು",
    nav_profile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    nav_signin: "ಲಾಗಿನ್ ಮಾಡಿ",
    nav_signout: "ನಿರ್ಗಮಿಸಿ",
    nav_owner_dashboard: "ಮಾಲೀಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",

    // Hero Section
    hero_eyebrow: "ಎಐ-ಚಾಲಿತ ಕೃಷಿ ಸಹಾಯ",
    hero_title: "ಎಐ ಚಾಲಿತ ರೈತರ ಮಿತ್ರ",
    hero_desc:
      "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಕ್ರಿಮಿಕೀಟ ನಿಯಂತ್ರಣ, ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ಕೃಷಿ ಯಂತ್ರಗಳ ಬುಕಿಂಗ್ ಮೂಲಕ ರೈತರಿಗೆ ನೆರವಾಗುತ್ತಿದೆ.",
    hero_explore_weather: "ಹವಾಮಾನ ವೀಕ್ಷಿಸಿ",
    hero_book_equipment: "ಯಂತ್ರ ಬುಕ್ ಮಾಡಿ",

    // Features Section
    features_eyebrow: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಾಧನಗಳು",
    features_title: "ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ (ಎಡದಿಂದ ಬಲಕ್ಕೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ)",
    feat_weather_title: "ಹವಾಮಾನ ಸಲಹೆಗಾರ",
    feat_weather_desc: "7 ದಿನಗಳ ನಿಖರ ಹವಾಮಾನ ವರದಿ ಮತ್ತು ಸಿಂಪಡಣೆ, ನೀರಾವರಿ ಸಲಹೆಗಳು.",
    feat_pest_title: "ಕ್ರಿಮಿಕೀಟ ಎಚ್ಚರಿಕೆ",
    feat_pest_desc: "ನಿಮ್ಮ ಗ್ರಾಮ ಮತ್ತು ಬೆಳೆಗೆ ಸೂಕ್ತವಾದ ರೋಗ ಮುನ್ಸೂಚನೆ ಎಚ್ಚರಿಕೆಗಳು.",
    feat_market_title: "ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ",
    feat_market_desc: "ನೇರ ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ಮಾರಾಟ ಅಥವಾ ಕಾಯುವಿಕೆಯ ಎಐ ಸಲಹೆ.",
    feat_voice_title: "ಧ್ವನಿ ಸಹಾಯ",
    feat_voice_desc: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ — ತ್ವರಿತ ಉತ್ತರ ಪಡೆಯಿರಿ.",
    feat_equipment_title: "ಯಂತ್ರಗಳ ಬಾಡಿಗೆ",
    feat_equipment_desc: "ಟ್ರ್ಯಾಕ್ಟರ್, ಹಾರ್ವೆಸ್ಟರ್ ಮತ್ತು ಡ್ರೋನ್‌ಗಳನ್ನು ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ.",

    // General Actions
    watch_reels: "ವೀಡಿಯೊ ನೋಡಿ",
    book_now: "ಈಗಲೇ ಬುಕ್ ಮಾಡಿ",
    open_tool: "ತೆರೆಯಿರಿ",

    // Government Schemes
    schemes_title: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು",
    scheme_active: "ಸಕ್ರಿಯ ಯೋಜನೆ",
    scheme_subsidy: "ಸಬ್ಸಿಡಿ ಯೋಜನೆ",
    scheme_credit: "ಸಾಲ ಯೋಜನೆ",
    scheme_pmkisan_title: "ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",
    scheme_pmkisan_benefit: "₹6,000/ವರ್ಷ — ₹2,000 ರ 3 ಕಂತುಗಳು DBT ಮೂಲಕ",
    scheme_pmkisan_desc:
      "ಎಲ್ಲಾ ಭೂಹಿಡಿಕೆ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ಆದಾಯ ಬೆಂಬಲ. ಪ್ರತಿ 4 ತಿಂಗಳಿಗೊಮ್ಮೆ ನೇರ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ.",
    scheme_pmfby_title: "ಪಿಎಂ ಫಸಲ್ ಬೀಮಾ ಯೋಜನೆ (PMFBY)",
    scheme_pmfby_benefit: "ಬೆಳೆ ವಿಮೆ: ಖಾರಿಫ್ 2%, ರಬಿ 1.5%, ವಾಣಿಜ್ಯ 5%",
    scheme_pmfby_desc: "ಬಿತ್ತನೆ ಪೂರ್ವದಿಂದ ಕೊಯ್ಲಿನ ನಂತರದ ಸಮಗ್ರ ಬೆಳೆ ವಿಮೆ. ಬಜೆಟ್: ₹69,515 ಕೋಟಿ.",
    scheme_smam_title: "SMAM — ಕೃಷಿ ಯಾಂತ್ರೀಕರಣ",
    scheme_smam_benefit: "ಟ್ರ್ಯಾಕ್ಟರ್, ಡ್ರೋನ್, ಟಿಲ್ಲರ್ ಮೇಲೆ 40-50% ಸಬ್ಸಿಡಿ",
    scheme_smam_desc: "SC/ST/ಸಣ್ಣ/ಅತಿ ಸಣ್ಣ/ಮಹಿಳಾ ರೈತರಿಗೆ 50%, ಇತರರಿಗೆ 40% ಸಬ್ಸಿಡಿ.",
    scheme_kcc_title: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)",
    scheme_kcc_benefit: "₹5 ಲಕ್ಷದವರೆಗೆ ಕೇವಲ 4% ಬಡ್ಡಿಯಲ್ಲಿ ಬೆಳೆ ಸಾಲ",
    scheme_kcc_desc: "₹2 ಲಕ್ಷದವರೆಗೆ ಜಾಮೀನು-ಮುಕ್ತ. ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಶಾಖೆ ಅಥವಾ e-KCC ಮೂಲಕ ಅರ್ಜಿ.",
  },
  hi: {
    // Navigation
    nav_home: "होम",
    nav_weather: "मौसम",
    nav_pest: "कीट एवं रोग",
    nav_market: "मंडी भाव",
    nav_equipment: "कृषि यंत्र",
    nav_reels: "रील्स",
    nav_profile: "मेरी प्रोफाइल",
    nav_signin: "साइन इन करें",
    nav_signout: "साइन आउट",
    nav_owner_dashboard: "मालिक डैशबोर्ड",

    // Hero Section
    hero_eyebrow: "एआई-संचालित कृषि",
    hero_title: "एआई संचालित किसान मित्र",
    hero_desc:
      "मौसम की जानकारी, कीट भविष्यवाणी, मंडी भाव और कृषि उपकरणों की बुकिंग के साथ किसानों के लिए सटीक निर्णय।",
    hero_explore_weather: "मौसम देखें",
    hero_book_equipment: "उपकरण बुक करें",

    // Features Section
    features_eyebrow: "स्मार्ट उपकरण",
    features_title: "विशेषताएं देखें (बायें से दायें स्क्रॉल करें)",
    feat_weather_title: "मौसम सलाहकार",
    feat_weather_desc: "7 दिनों का सटीक मौसम पूर्वानुमान और सिंचाई व छिड़काव की सलाह।",
    feat_pest_title: "कीट चेतावनी",
    feat_pest_desc: "आपकी फसल और गांव के अनुसार 10 दिन पहले कीट प्रकोप की चेतावनी।",
    feat_market_title: "मंडी विश्लेषण",
    feat_market_desc: "लाइव मंडी भाव, मूल्य रुझान और बेचने या रोकने की एआई सलाह।",
    feat_voice_title: "वॉयस असिस्टेंट",
    feat_voice_desc: "अपनी भाषा में बोलकर खेती के सवाल पूछें — तुरंत एआई उत्तर पाएं।",
    feat_equipment_title: "उपकरण बुकिंग",
    feat_equipment_desc: "अपने पास के सत्यापित मालिकों से ट्रैक्टर व हार्वेस्टर किराये पर लें।",

    // General Actions
    watch_reels: "रील्स देखें",
    book_now: "अभी बुक करें",
    open_tool: "खोलें",

    // Government Schemes
    schemes_title: "सरकारी योजनाएं और सब्सिडी",
    scheme_active: "सक्रिय योजना",
    scheme_subsidy: "सब्सिडी योजना",
    scheme_credit: "ऋण योजना",
    scheme_pmkisan_title: "पीएम-किसान सम्मान निधि",
    scheme_pmkisan_benefit: "₹6,000/वर्ष — ₹2,000 की 3 किस्तें DBT द्वारा",
    scheme_pmkisan_desc:
      "सभी भूधारक किसान परिवारों को आय सहायता। हर 4 महीने सीधा बैंक खाते में ट्रांसफर।",
    scheme_pmfby_title: "पीएम फसल बीमा योजना (PMFBY)",
    scheme_pmfby_benefit: "फसल बीमा: खरीफ 2%, रबी 1.5%, वाणिज्यिक 5%",
    scheme_pmfby_desc:
      "बुवाई से कटाई तक व्यापक फसल बीमा। बजट: ₹69,515 करोड़। उपग्रह और ड्रोन से तेज़ दावा निपटान।",
    scheme_smam_title: "SMAM — कृषि यंत्रीकरण",
    scheme_smam_benefit: "ट्रैक्टर, ड्रोन, टिलर पर 40-50% सब्सिडी",
    scheme_smam_desc: "SC/ST/लघु/सीमांत/महिला किसानों को 50%, अन्य को 40% सब्सिडी।",
    scheme_kcc_title: "किसान क्रेडिट कार्ड (KCC)",
    scheme_kcc_benefit: "₹5 लाख तक मात्र 4% ब्याज पर फसल ऋण",
    scheme_kcc_desc: "₹2 लाख तक बिना जमानत। किसी भी बैंक शाखा या e-KCC से आवेदन करें।",
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("krishimitra_lang");
      if (saved === "kn" || saved === "hi" || saved === "en") {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("krishimitra_lang", lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
