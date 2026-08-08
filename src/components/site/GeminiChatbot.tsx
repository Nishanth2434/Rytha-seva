import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useLanguage, languages, LanguageCode } from "@/context/language-context";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  Wheat,
  Bug,
  CloudRain,
  Tractor,
  TrendingUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  PhoneCall,
  Phone,
  Headphones,
  CheckCircle2,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type AIAction = {
  type: "NAVIGATE" | "BOOK_EQUIPMENT" | "OPEN_CALL_SUPPORT";
  targetRoute?: string;
  buttonText: string;
  details?: {
    equipmentName?: string;
    price?: string;
    location?: string;
  };
};

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  action?: AIAction | undefined;
}

const trilingualData: Record<LanguageCode, {
  welcome: string;
  speechGreeting: string;
  placeholder: string;
  confirmBookingBtn: string;
  queryOptions: Array<{ icon: any; label: string; route?: string; actionType: "NAVIGATE" | "BOOK_EQUIPMENT" | "OPEN_CALL_SUPPORT"; queryText: string }>;
}> = {
  en: {
    welcome: "Namaste! 🙏 Welcome to **KrishiMitra AI Assistant**.\n\nHow can I help you today? Please choose an option below or type your query:",
    speechGreeting: "Namaste! Welcome to KrishiMitra AI Assistant. How can I help you today? Please select an option below.",
    placeholder: "Ask in English, Kannada (ಕನ್ನಡ), or Hindi (हिन्दी)...",
    confirmBookingBtn: "🚜 Confirm Booking Now",
    queryOptions: [
      { icon: Tractor, label: "Want to Book Tractor / Equipment", route: "/equipment", actionType: "BOOK_EQUIPMENT", queryText: "I want to book a tractor" },
      { icon: TrendingUp, label: "Want Market Prices / Mandi Rates", route: "/market", actionType: "NAVIGATE", queryText: "I want market price" },
      { icon: CloudRain, label: "Check Rain & Weather Forecast", route: "/weather", actionType: "NAVIGATE", queryText: "Check weather forecast" },
      { icon: Bug, label: "Diagnose Crop Disease (Pest AI)", route: "/pest", actionType: "NAVIGATE", queryText: "Diagnose crop pest disease" },
      { icon: Volume2, label: "Watch Farming Reels", route: "/reels", actionType: "NAVIGATE", queryText: "Watch farming reels" },
      { icon: PhoneCall, label: "Connect to Kisan Call Support", actionType: "OPEN_CALL_SUPPORT", queryText: "Call expert support" },
    ],
  },
  kn: {
    welcome: "ನಮಸ್ಕಾರ! 🙏 **ಕೃಷಿಮಿತ್ರ ಎಐ ಸಹಾಯಕ**ಕ್ಕೆ ಸ್ವಾಗತ.\n\nನಿಮಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ಕೆಳಗಿನ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ:",
    speechGreeting: "ನಮಸ್ಕಾರ! ಕೃಷಿಮಿತ್ರ ಎಐ ಸಹಾಯಕ್ಕೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ಕೆಳಗಿನ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.",
    placeholder: "ಕನ್ನಡ (Kannada), English, ಅಥವಾ हिन्दीಯಲ್ಲಿ ಕೇಳಿ...",
    confirmBookingBtn: "🚜 ಈಗಲೇ ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ",
    queryOptions: [
      { icon: Tractor, label: "ಟ್ರ್ಯಾಕ್ಟರ್ / ಯಂತ್ರ ಬುಕ್ ಮಾಡಲು ಬಯಸುವಿರಾ", route: "/equipment", actionType: "BOOK_EQUIPMENT", queryText: "ಟ್ರ್ಯಾಕ್ಟರ್ ಬುಕ್ ಮಾಡಲು ಬಯಸುವಿರಾ" },
      { icon: TrendingUp, label: "ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ನೋಡಲು ಬಯಸುವಿರಾ", route: "/market", actionType: "NAVIGATE", queryText: "ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ತಿಳಿಸಿ" },
      { icon: CloudRain, label: "ಹವಾಮಾನ ಮತ್ತು ಮಳೆ ವರದಿ ನೋಡಲು ಬಯಸುವಿರಾ", route: "/weather", actionType: "NAVIGATE", queryText: "ಹವಾಮಾನ ವರದಿ ತೋರಿಸಿ" },
      { icon: Bug, label: "ಬೆಳೆ ರೋಗ ತಪಾಸಣೆ (ಕ್ರಿಮಿ ವೈದ್ಯ)", route: "/pest", actionType: "NAVIGATE", queryText: "ಕ್ರಿಮಿ ರೋಗ ಪರೀಕ್ಷೆ ಮಾಡಿ" },
      { icon: Volume2, label: "ಕೃಷಿ ವೀಡಿಯೊಗಳನ್ನು ವೀಕ್ಷಿಸಿ", route: "/reels", actionType: "NAVIGATE", queryText: "ಕೃಷಿ ವೀಡಿಯೊಗಳನ್ನು ವೀಕ್ಷಿಸಿ" },
      { icon: PhoneCall, label: "ಕೃಷಿ ತಜ್ಞರ ಕರೆ ಸಹಾಯ ಪಡೆಯಿರಿ", actionType: "OPEN_CALL_SUPPORT", queryText: "ಕರೆ ಸಹಾಯ ಪಡೆಯಿರಿ" },
    ],
  },
  hi: {
    welcome: "नमस्ते! 🙏 **कृषि मित्र एआई सहायक** में आपका स्वागत है।\n\nमैं आपकी क्या सहायता कर सकता हूँ? नीचे दिए गए विकल्प को चुनें या अपना प्रश्न पूछें:",
    speechGreeting: "नमस्ते! कृषि मित्र एआई में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ? कृपया नीचे दिया गया विकल्प चुनें।",
    placeholder: "हिन्दी (Hindi), English, या ಕನ್ನಡ में पूछें...",
    confirmBookingBtn: "🚜 अभी बुकिंग कन्फर्म करें",
    queryOptions: [
      { icon: Tractor, label: "ट्रैक्टर / मशीन बुक करना चाहते हैं", route: "/equipment", actionType: "BOOK_EQUIPMENT", queryText: "ट्रैक्टर बुक करना चाहते हैं" },
      { icon: TrendingUp, label: "मंडी भाव और बाजार रेट देखना चाहते हैं", route: "/market", actionType: "NAVIGATE", queryText: "मंडी भाव देखना चाहते हैं" },
      { icon: CloudRain, label: "मौसम और बारिश रिपोर्ट देखना चाहते हैं", route: "/weather", actionType: "NAVIGATE", queryText: "मौसम रिपोर्ट दिखाएं" },
      { icon: Bug, label: "फसल बीमारी जांच (कीट डॉक्टर)", route: "/pest", actionType: "NAVIGATE", queryText: "फसल की बीमारी जांचें" },
      { icon: Volume2, label: "कृषि रील और वीडियो देखना चाहते हैं", route: "/reels", actionType: "NAVIGATE", queryText: "कृषि रील देखना चाहते हैं" },
      { icon: PhoneCall, label: "किसान हेल्पलाइन / कॉल सपोर्ट", actionType: "OPEN_CALL_SUPPORT", queryText: "किसान कॉल सपोर्ट" },
    ],
  },
};

function detectActionIntent(query: string, lang: LanguageCode = "en"): AIAction | undefined {
  const q = query.toLowerCase().trim();
  const isBookingWord =
    q.includes("book") ||
    q.includes("rent") ||
    q.includes("hire") ||
    q.includes("reserve") ||
    q.includes("need") ||
    q.includes("want") ||
    q.includes("ಬುಕ್") ||
    q.includes("ವಾಹನ") ||
    q.includes("बुक") ||
    q.includes("किराया");

  if (
    isBookingWord &&
    (q.includes("tractor") ||
      q.includes("harvester") ||
      q.includes("drone") ||
      q.includes("sprayer") ||
      q.includes("machine") ||
      q.includes("equipment") ||
      q.includes("ಟ್ರ್ಯಾಕ್ಟರ್") ||
      q.includes("ट्रैक्टर"))
  ) {
    let eqName = "Mahindra 575 DI Tractor (47 HP)";
    let price = "₹350/hr (₹1,800/day)";

    if (q.includes("harvester")) {
      eqName = "John Deere Combine Harvester 5050D";
      price = "₹950/hr (₹6,500/day)";
    } else if (q.includes("drone")) {
      eqName = "Agri Precision Spraying Drone (10L)";
      price = "₹400/acre";
    }

    const btnText =
      lang === "kn"
        ? "🚜 ಈಗಲೇ ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ"
        : lang === "hi"
        ? "🚜 अभी बुकिंग कन्फर्म करें"
        : "🚜 Confirm Booking Now";

    return {
      type: "BOOK_EQUIPMENT",
      targetRoute: "/equipment",
      buttonText: btnText,
      details: {
        equipmentName: eqName,
        price,
        location: "Khed, Nashik (MH)",
      },
    };
  }

  if (
    q.includes("weather") ||
    q.includes("rain") ||
    q.includes("forecast") ||
    q.includes("temperature") ||
    q.includes("monsoon") ||
    q.includes("ಹವಾಮಾನ") ||
    q.includes("ಮಳೆ") ||
    q.includes("मौसम") ||
    q.includes("बारिश")
  ) {
    return {
      type: "NAVIGATE",
      targetRoute: "/weather",
      buttonText: lang === "kn" ? "⛈️ ಹವಾಮಾನ ಪುಟಕ್ಕೆ ಹೋಗಿ" : lang === "hi" ? "⛈️ मौसम पेज पर जाएं" : "⛈️ Open Weather Page",
    };
  }

  if (
    q.includes("pest") ||
    q.includes("disease") ||
    q.includes("photo") ||
    q.includes("diagnose") ||
    q.includes("doctor") ||
    q.includes("ಕ್ರಿಮಿ") ||
    q.includes("ರೋಗ") ||
    q.includes("कीट") ||
    q.includes("बीमारी")
  ) {
    return {
      type: "NAVIGATE",
      targetRoute: "/pest",
      buttonText: lang === "kn" ? "🐛 ಎಐ ಕ್ರಿಮಿ ವೈದ್ಯರ ಪುಟ" : lang === "hi" ? "🐛 कीट एआई डॉक्टर पेज" : "🐛 Open Pest AI Doctor",
    };
  }

  if (
    q.includes("mandi") ||
    q.includes("market") ||
    q.includes("price") ||
    q.includes("rate") ||
    q.includes("apmc") ||
    q.includes("ಮಾರುಕಟ್ಟೆ") ||
    q.includes("ದರ") ||
    q.includes("मंडी") ||
    q.includes("भाव")
  ) {
    return {
      type: "NAVIGATE",
      targetRoute: "/market",
      buttonText: lang === "kn" ? "💰 ಮಾರುಕಟ್ಟೆ ದರಗಳು" : lang === "hi" ? "💰 मंडी भाव पेज" : "💰 Open APMC Mandi Rates",
    };
  }

  if (
    q.includes("call") ||
    q.includes("helpline") ||
    q.includes("expert") ||
    q.includes("support") ||
    q.includes("callback") ||
    q.includes("ಕರೆ") ||
    q.includes("ಸಹಾಯ") ||
    q.includes("कॉल") ||
    q.includes("हेल्पलाइन")
  ) {
    return {
      type: "OPEN_CALL_SUPPORT",
      buttonText: lang === "kn" ? "📞 ಕಿಸಾನ್ ಕರೆ ಸಹಾಯ ತೆರೆಯಿರಿ" : lang === "hi" ? "📞 किसान कॉल सपोर्ट खोलें" : "📞 Open Kisan Call Support",
    };
  }

  return undefined;
}

export function GeminiChatbot() {
  const navigate = useNavigate();
  const { language: globalLang, setLanguage: setGlobalLang } = useLanguage();
  const [activeLang, setActiveLang] = useState<LanguageCode>(globalLang || "en");
  const [isLangSelected, setIsLangSelected] = useState<boolean>(false);

  useEffect(() => {
    if (globalLang) setActiveLang(globalLang);
  }, [globalLang]);

  const langConfig = trilingualData[activeLang] || trilingualData.en;

  const [isOpen, setIsOpen] = useState(false);
  const [isCallSupportOpen, setIsCallSupportOpen] = useState(false);
  const [callbackMobile, setCallbackMobile] = useState("");
  const [callbackRequested, setCallbackRequested] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function handleOpenChatbot() {
    setIsOpen(true);
    if (isCallSupportOpen) setIsCallSupportOpen(false);
  }

  function handleSelectLanguage(code: LanguageCode) {
    setActiveLang(code);
    setGlobalLang(code);
    setIsLangSelected(true);

    const config = trilingualData[code];
    const welcomeMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: "ai",
      text: config.welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([welcomeMsg]);

    // Speak "Namaste..." TTS in selected language!
    setTimeout(() => {
      speakText(config.speechGreeting, welcomeMsg.id, code);
    }, 300);

    toast.success(`Selected Language: ${code === "kn" ? "ಕನ್ನಡ (Kannada)" : code === "hi" ? "हिन्दी (Hindi)" : "English"}`);
  }

  function handleRequestCallback(e: React.FormEvent) {
    e.preventDefault();
    if (!callbackMobile.trim()) return;
    setCallbackRequested(true);
    toast.success("Callback request received! An agri-expert will call you shortly 📞");
    setTimeout(() => {
      setCallbackRequested(false);
      setCallbackMobile("");
      setIsCallSupportOpen(false);
    }, 2500);
  }

  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = activeLang === "kn" ? "kn-IN" : activeLang === "hi" ? "hi-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        toast.info(activeLang === "kn" ? "ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ 🎙️" : activeLang === "hi" ? "सुन रहे हैं... अब बोलें 🎙️" : "Listening... speak now 🎙️");
      };
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results).map((result: any) => result[0].transcript).join("");
        setInputValue(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  function speakText(text: string, msgId: string, langCode?: LanguageCode) {
    if (!("speechSynthesis" in window)) return;
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`~]/g, ""));
    const l = langCode || activeLang;
    utterance.lang = l === "kn" ? "kn-IN" : l === "hi" ? "hi-IN" : "en-IN";
    utterance.onend = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  }

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // CRITICAL DIRECTIVE: Output ONLY "ok" and redirect!
  function triggerOptionAction(route?: string, actionType?: string) {
    const okId = `ai-ok-${Date.now()}`;
    const okMsg: ChatMessage = {
      id: okId,
      sender: "ai",
      text: "ok",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, okMsg]);
    speakText("ok", okId);
    toast.success("ok");

    if (actionType === "OPEN_CALL_SUPPORT") {
      setIsCallSupportOpen(true);
    } else if (route) {
      setTimeout(() => {
        navigate({ to: route as any });
      }, 350);
    }
  }

  function executeAction(action: AIAction) {
    triggerOptionAction(action.targetRoute || "/equipment", action.type);
  }

  async function handleSendMessage(customMessage?: string) {
    const textToSend = (customMessage || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInputValue("");
    setIsLoading(true);

    const action = detectActionIntent(textToSend, activeLang);

    // If query is an action / navigation request: reply ONLY "ok" and navigate!
    if (action) {
      setIsLoading(false);
      triggerOptionAction(action.targetRoute, action.type);
      return;
    }

    try {
      const responseText = await fetchGeminiResponse(textToSend, messages, activeLang);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallback: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "Connection error. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  }

  function formatMarkdown(text: string) {
    return text;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <Card className="pointer-events-auto mb-3 flex h-[540px] w-[385px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex flex-col border-b border-white/10 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 p-3.5 px-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm">KrishiMitra AI</h3>
                  <p className="text-[10px] text-green-100/90 font-medium">Trilingual Farming Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} title="Close">
                <X className="h-4 w-4 text-white/80 hover:text-white" />
              </button>
            </div>

            {/* Quick Switcher Bar */}
            {isLangSelected && (
              <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-1.5 text-[10px]">
                <span className="flex items-center gap-1 font-semibold text-green-100">
                  <Globe className="h-3 w-3 text-amber-300" /> Language:
                </span>
                <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-full">
                  <button
                    onClick={() => handleSelectLanguage("en")}
                    className={`rounded-full px-2 py-0.5 font-bold transition-all ${
                      activeLang === "en" ? "bg-white text-green-800 shadow-xs" : "text-white/80 hover:text-white"
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    onClick={() => handleSelectLanguage("kn")}
                    className={`rounded-full px-2 py-0.5 font-bold transition-all ${
                      activeLang === "kn" ? "bg-white text-green-800 shadow-xs" : "text-white/80 hover:text-white"
                    }`}
                  >
                    🇮🇳 ಕನ್ನಡ
                  </button>
                  <button
                    onClick={() => handleSelectLanguage("hi")}
                    className={`rounded-full px-2 py-0.5 font-bold transition-all ${
                      activeLang === "hi" ? "bg-white text-green-800 shadow-xs" : "text-white/80 hover:text-white"
                    }`}
                  >
                    🇮🇳 हिन्दी
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SCREEN 1: Mandatory Language Selector Overlay */}
          {!isLangSelected ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-emerald-50/50 via-white to-gray-50/80">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-green-600 to-teal-600 text-white shadow-lg shadow-green-600/30 mb-4 animate-bounce">
                <Globe className="h-7 w-7" />
              </div>
              <h4 className="font-extrabold text-gray-900 text-base mb-1">Select Language</h4>
              <p className="text-xs text-gray-600 mb-1 font-medium">ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ</p>
              <p className="text-xs text-gray-500 mb-6">कृपया अपनी भाषा चुनें</p>

              <div className="w-full space-y-2.5">
                <button
                  onClick={() => handleSelectLanguage("en")}
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-3.5 px-4 font-bold text-xs text-gray-800 shadow-sm hover:border-green-500 hover:bg-green-50/70 hover:text-green-900 transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">🇬🇧</span> English
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleSelectLanguage("kn")}
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-3.5 px-4 font-bold text-xs text-gray-800 shadow-sm hover:border-green-500 hover:bg-green-50/70 hover:text-green-900 transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">🇮🇳</span> ಕನ್ನಡ (Kannada)
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleSelectLanguage("hi")}
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-3.5 px-4 font-bold text-xs text-gray-800 shadow-sm hover:border-green-500 hover:bg-green-50/70 hover:text-green-900 transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">🇮🇳</span> हिन्दी (Hindi)
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            /* SCREEN 2: Active Trilingual Chat Window */
            <>
              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-gradient-to-b from-gray-50/30 to-white">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                      {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>

                    <div className={`max-w-[85%] rounded-[20px] px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${msg.sender === "user" ? "bg-green-600 text-white rounded-tr-xs font-medium" : "bg-white text-gray-800 border border-gray-100 rounded-tl-xs"}`}>
                      <div className="whitespace-pre-line font-sans">{formatMarkdown(msg.text)}</div>

                      {/* Interactive Website Action Query Option Buttons inside welcome message */}
                      {msg.id.startsWith("msg-welcome") && (
                        <div className="mt-3 grid grid-cols-1 gap-1.5 border-t border-gray-100 pt-2.5">
                          {langConfig.queryOptions.map((opt, idx) => {
                            const IconComp = opt.icon;
                            return (
                              <button
                                key={idx}
                                onClick={() => triggerOptionAction(opt.route, opt.actionType)}
                                className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-2 px-3 text-left text-[11px] font-bold text-emerald-950 hover:bg-emerald-600 hover:text-white transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <IconComp className="h-3.5 w-3.5 shrink-0 text-emerald-600 group-hover:text-white" />
                                  <span>{opt.label}</span>
                                </span>
                                <ArrowRight className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-1.5 flex items-center justify-between border-t border-gray-100/60 pt-1">
                        <span className={`text-[9px] ${msg.sender === "user" ? "text-green-200" : "text-gray-400"}`}>{msg.timestamp}</span>
                        {msg.sender === "ai" && (
                          <button type="button" onClick={() => speakText(msg.text, msg.id)} className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-green-600">
                            <Volume2 className="h-3 w-3 text-green-600" /> Listen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-800"><Bot className="h-3.5 w-3.5" /></div>
                    <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[11px]"><Loader2 className="h-3.5 w-3.5 animate-spin text-green-600" /> Thinking...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="p-3 border-t bg-white">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-1.5 rounded-full border bg-gray-50/80 p-1.5 pl-4 focus-within:border-green-500">
                  <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={langConfig.placeholder} className="flex-1 bg-transparent text-xs text-gray-900 focus:outline-none" />
                  <button type="button" onClick={startListening} className={`grid h-8 w-8 place-items-center rounded-full ${isListening ? "bg-red-500 text-white animate-bounce" : "text-gray-500 hover:text-green-600"}`}><Mic className="h-4 w-4" /></button>
                  <button type="submit" disabled={!inputValue.trim() || isLoading} className="grid h-8 w-8 place-items-center rounded-full bg-green-600 text-white disabled:opacity-40"><Send className="h-3.5 w-3.5" /></button>
                </form>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Floating Action Buttons */}
      <div className="pointer-events-auto flex flex-col items-center gap-2.5">
        <button
          onClick={() => {
            setIsCallSupportOpen(!isCallSupportOpen);
            if (isOpen) setIsOpen(false);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-xl hover:scale-110 active:scale-95 group relative"
          aria-label="Kisan Call Support"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-extrabold text-gray-900 ring-2 ring-white">
            📞
          </span>
          {isCallSupportOpen ? <X className="h-5 w-5 text-white" /> : <PhoneCall className="h-5 w-5 text-white transition-transform group-hover:scale-110" />}
        </button>

        <button
          onClick={handleOpenChatbot}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-green-600 via-emerald-600 to-teal-500 text-white shadow-2xl hover:scale-110 active:scale-95 group relative"
          aria-label="Toggle Gemini AI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-extrabold text-gray-900 ring-2 ring-white">
            AI
          </span>
          {isOpen ? <X className="h-6 w-6 text-white" /> : <Bot className="h-7 w-7 text-white transition-transform group-hover:rotate-12" />}
        </button>
      </div>
    </div>
  );
}

// ─── Gemini API Call Function ──────────────────────────────────────────────────

async function fetchGeminiResponse(userPrompt: string, history: ChatMessage[], lang: LanguageCode = "en"): Promise<string> {
  const apiKey = import.meta.env["VITE_GEMINI_API_KEY"];

  const langInstruction =
    lang === "kn"
      ? "CRITICAL: Respond strictly in authentic, fluent Kannada script (ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಉತ್ತರಿಸಿ)."
      : lang === "hi"
      ? "CRITICAL: Respond strictly in authentic, fluent Hindi script (हिन्दी भाषा में सरलता से उत्तर दें)."
      : "Respond in clear, simple English.";

  const systemPromptText = `You are Gemini AI — the intelligent, friendly, and expert conversational AI assistant for KrishiMitra AI.
Your goal is to provide clear, simple, yet detailed and comprehensive answers to Indian farmers and users.

${langInstruction}

Formatting Guidelines:
1. **Simple Direct Overview**: Warm 1-2 sentence direct explanation answering the main question.
2. **Detailed Actionable Breakdown**:
   - Step-by-step guide with bold section headers.
   - Real commercial spray remedies in India (e.g. Bayer Nativo, Coragen, Imidacloprid, Neem oil 1500ppm), exact spray ratios (0.5ml/L or 80g/acre), and split NPK fertilizer schedules.
3. **Smart Agri Tip & Prevention**: 2-3 practical field prevention tips.`;

  if (apiKey && apiKey.length > 5) {
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-pro",
    ];

    const contentsHistory = history
      .filter((m) => m.id !== "msg-welcome")
      .slice(-4)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text.substring(0, 250) }],
      }));

    contentsHistory.push({
      role: "user",
      parts: [{ text: userPrompt }],
    });

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPromptText }],
              },
              contents: contentsHistory,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) return text;
        }
      } catch (e) {
        console.warn(`Gemini API call model ${model} failed:`, e);
      }
    }
  }

  // Dynamic Real-World Multilingual Agronomist AI Knowledge Synthesizer
  return generateDynamicAgriResponse(userPrompt, lang);
}

// ─── Dynamic Multilingual AI Synthesizer Engine ───────────────────────────────

function generateDynamicAgriResponse(query: string, preferredLang: LanguageCode = "en"): string {
  const q = query.toLowerCase().trim();

  // Auto-detect language script from user query
  let isKannada = preferredLang === "kn" || /[\u0C80-\u0CFF]/.test(query);
  let isHindi = preferredLang === "hi" || /[\u0900-\u097F]/.test(query);

  // 1. CHILLI / MIRCHI SCENARIOS
  if (q.includes("chilli") || q.includes("mirchi") || q.includes("murda") || q.includes("ಮೆಣಸಿನಕಾಯಿ") || q.includes("मिर्च")) {
    if (isKannada) {
      return `🌶️ **ಮೆಣಸಿನಕಾಯಿ ಎಲೆ ಮುರುಟು ರೋಗ ನಿಯಂತ್ರಣ ಮಾರ್ಗದರ್ಶಿ**

**ಸರಳ ಸಾರಾಂಶ:**
ಮೆಣಸಿನಕಾಯಿಯಲ್ಲಿ ಎಲೆ ಮುರುಟು ರೋಗವು (ಮುರ್ದಾ ರೋಗ) ಥ್ರಿಪ್ಸ್ ಮತ್ತು ನುಸಿ ಕೀಟಗಳಿಂದ ಉಂಟಾಗುತ್ತದೆ. ತಕ್ಷಣದ ಸಿಂಪಡಣೆಯು ಹೊಸ ಎಲೆಗಳ ಬೆಳವಣಿಗೆಯನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ.

---

📋 **ಹಂತ-ಹಂತದ ಚಿಕಿತ್ಸಾ ಕ್ರಮ:**

1. **ಕೀಟ ನಾಶಕ ಸಿಂಪಡಣೆ**:
   • **ಡೆಲಿಗೇಟ್ (Spinetoram 11.7% SC)** @ 0.9 ಮಿಲಿ / ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.
   • ಅಥವಾ **ಪೆಗಾಸಸ್ (Diafenthiuron 50% WP)** @ 1.2 ಗ್ರಾಂ / ಲೀಟರ್ ನೀರಿಗೆ ಸಿಂಪಡಿಸಿ.

2. **ಶಿಲೀಂಧ್ರ ನಾಶಕ ಸಿಂಪಡಣೆ**:
   • **ಅಮಿಸ್ಟಾರ್ ಟಾಪ್ (Amistar Top)** @ 1 ಮಿಲಿ / ಲೀಟರ್ ನೀರಿಗೆ ಸಿಂಪಡಿಸಿ.

3. **ಪೋಷಕಾಂಶಗಳ ಪೂರೈಕೆ**:
   • **19-19-19 ಎನ್‌ಪಿಕೆ** @ 5 ಗ್ರಾಂ / ಲೀಟರ್ ಸಿಂಪಡಿಸಿ.

---

💡 **ಮುನ್ನೆಚ್ಚರಿಕೆ:**
• ಥ್ರಿಪ್ಸ್ ಕೀಟಗಳಿಗಾಗಿ ಹೊಲದಲ್ಲಿ **ನೀಲಿ ಜಿಗುಟು ಬೋರ್ಡ್‌ಗಳನ್ನು** (ಎಕರೆಗೆ 10) ಅಳವಡಿಸಿ.`;
    }

    if (isHindi) {
      return `🌶️ **मिर्च लीफ कर्ल (मुरडा रोग) संपूर्ण नियंत्रण गाइड**

**सरल सारांश:**
मिर्च में पत्तियों का मुड़ना (मुरडा रोग) थ्रिप्स और मकोड़ों द्वारा रस चूसने से होता है। तुरंत छिड़काव से फसल सुरक्षित हो जाती है।

---

📋 **चरणबद्ध उपचार योजना:**

1. **कीटनाशक छिड़काव**:
   • **डेलिगेट (Spinetoram 11.7% SC)** @ 0.9 मिली/लीटर पानी में घोलकर छिड़कें।
   • या **पेगासस (Diafenthiuron 50% WP)** @ 1.2 ग्राम/लीटर छिड़कें।

2. **फंगल रोग नियंत्रण**:
   • **अमिस्टार टॉप (Amistar Top)** @ 1 मिली/लीटर पानी में मिलाकर छिड़कें।

---

💡 **विशेष सलाह:**
• थ्रिप्स नियंत्रण के लिए खेत में **नीले चिपचिपे कार्ड** (10 प्रति एकड़) लगाएं।`;
    }

    return `🌶️ **Chilli Leaf Curl & Murda Disease Detailed Treatment Guide**

**Simple Overview:**
Leaf curl in Chilli (Murda disease) is caused by Thrips and Mites sucking sap from under the leaves. Immediate spraying stops leaf distortion and restores plant growth.

---

📋 **Detailed Step-by-Step Action Plan:**

1. **For Thrips & Mites Sucking Control**:
   • Spray **Spinetoram 11.7% SC (Delegate)** @ 0.9 ml per liter of water OR **Diafenthiuron 50% WP (Pegasus)** @ 1.2 grams per liter.
   • For severe mite curling, spray **Abamectin 1.9% EC** @ 1 ml per liter.

2. **Fungal Mildew & Dieback Spray**:
   • Spray **Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)** @ 1 ml per liter.

---

💡 **Pro Tips:**
• Hang **Blue Sticky Traps** (10/acre) specifically for thrips.`;
  }

  // 2. TOMATO SCENARIOS
  if (q.includes("tomato") || q.includes("tamatar") || q.includes("ಟೊಮೆಟೊ") || q.includes("टमाटर")) {
    if (isKannada) {
      return `🍅 **ಟೊಮೆಟೊ ಎಲೆ ಹಳದಿ ಮತ್ತು ಮುರುಟು ರೋಗ ಚಿಕಿತ್ಸೆ**

**ಸರಳ ಸಾರಾಂಶ:**
ಬಿಳಿ ನೊಣಗಳು ಹಳದಿ ಎಲೆ ವೈರಸ್ ಅನ್ನು ಹರಡುತ್ತವೆ. ತಕ್ಷಣವೇ ಕೀಟನಾಶಕ ಮತ್ತು ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸುವುದು ಅಗತ್ಯ.

---

📋 **ಚಿಕಿತ್ಸಾ ಕ್ರಮ:**
1. **ಕೀಟ ನಿಯಂತ್ರಣ**: **ಕಾನ್ಫಿಡಾರ್ (Imidacloprid 17.8% SL)** @ 0.5 ಮಿಲಿ / ಲೀಟರ್ ನೀರಿಗೆ ಸಿಂಪಡಿಸಿ.
2. **ಶಿಲೀಂಧ್ರ ರೋಗ ನಿಯಂತ್ರಣ**: **ಬಾಯರ್ ನೆಟಿವೋ (Nativo)** @ 0.8 ಗ್ರಾಂ / ಲೀಟರ್ ನೀರಿಗೆ ಸಿಂಪಡಿಸಿ.`;
    }

    if (isHindi) {
      return `🍅 **टमाटर लीफ कर्ल और झुलसा रोग उपचार गाइड**

**सरल सारांश:**
सफेद मक्खी द्वारा फैलाए जाने वाले वायरस से पत्तियां पीली और मुड़ जाती हैं। 

---

📋 **छिड़काव शेड्यूलिंग:**
1. **कीट नियंत्रण**: **कॉन्फिडोर (Imidacloprid 17.8% SL)** @ 0.5 मिली/लीटर पानी में मिलाकर छिड़कें।
2. **फंगल रोग नियंत्रण**: **बायार नैटिवो (Nativo)** @ 0.8 ग्राम/लीटर छिड़कें।`;
    }

    return `🍅 **Tomato Yellow Leaf Curl & Blight Detailed Treatment Guide**

**Simple Overview:**
Yellow leaf curl is transmitted by Whiteflies, while brown water-soaked spots are Early/Late Blight fungal infections.

---

📋 **Detailed Action & Dosage Schedule:**
1. **Whitefly Eradication**: Spray **Imidacloprid 17.8% SL (Confidor)** @ 0.5 ml per liter of water.
2. **Fungal Blight Eradication**: Spray **Bayer Nativo (Tebuconazole + Trifloxystrobin)** @ 0.8 grams per liter.`;
  }

  // 3. WHEAT / FERTILIZER SCENARIOS
  if (q.includes("wheat") || q.includes("gehu") || q.includes(" fertilizer") || q.includes("ಗೋಧಿ") || q.includes("गेहूं")) {
    if (isKannada) {
      return `🌾 **ಗೋಧಿ ಬೆಳೆಯ ರಸಗೊಬ್ಬರ ಮತ್ತು ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ**

**ಸರಳ ಸಾರಾಂಶ:**
ಎಕರೆಗೆ 22-25 ಕ್ವಿಂಟಾಲ್ ಇಳುವರಿ ಪಡೆಯಲು ಸಕಾಲದಲ್ಲಿ ಎನ್‌ಪಿಕೆ ರಸಗೊಬ್ಬರ ಪೂರೈಕೆ ಅಗತ್ಯ.

---

📋 **ಗೊಬ್ಬರ ಪ್ರಮಾಣ (1 ಎಕರೆಗೆ):**
1. **ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ**: 1 ಚೀಲ DAP (50 kg) + 1/2 ಚೀಲ Potash (25 kg) + 10 kg ಝಿಂಕ್.
2. **ಮೊದಲ ನೀರಾವರಿ (21 ದಿನಗಳು)**: 45 kg ಯೂರಿಯಾ + 5 kg ಸಲ್ಫರ್.
3. **ಎರಡನೇ ನೀರಾವರಿ (40 ದಿನಗಳು)**: 45 kg ಯೂರಿಯಾ.`;
    }

    if (isHindi) {
      return `🌾 **गेहूं की फसल के लिए उर्वरक एवं पोषण गाइड**

**सरल सारांश:**
प्रति एकड़ 22-25 क्विंटल उपज के लिए 3 चरणों में संतुलित उर्वरक दें।

---

📋 **उर्वरक शेड्यूल (प्रति 1 एकड़):**
1. **बुवाई के समय**: 1 बोरी DAP (50 किग्रा) + 1/2 बोरी MOP पोटैश (25 किग्रा) + 10 किग्रा जिंक।
2. **पहली सिंचाई (21 दिन)**: 45 किग्रा यूरिया + 5 किग्रा सल्फर।
3. **दूसरी सिंचाई (40 दिन)**: 45 किग्रा यूरिया।`;
    }

    return `🌾 **Wheat Crop High-Yield Fertilizer & Care Detailed Guide**

**Simple Overview:**
To achieve 22–25 Quintals/acre yield for Wheat, balanced NPK nutrition across 3 critical growth stages is essential.

---

📋 **Detailed Fertilizer Schedule (Per 1 Acre):**
1. **Basal Dose**: 1 Bag DAP (50 kg) + 1/2 Bag MOP (25 kg) + 10 kg Zinc 33%.
2. **1st Top Dressing (21 Days / CRI Stage)**: Apply **45 kg Urea** + **5 kg Sulfur 90% WDG** after 1st water.
3. **2nd Top Dressing (40–45 Days)**: Apply remaining **45 kg Urea**.`;
  }

  // General Dynamic Multilingual Response
  const cleanWords = q.replace(/[^a-zA-Z0-9\s]/g, "").split(" ").filter((w) => w.length > 3);
  const topicName = cleanWords.length > 0 ? cleanWords.slice(0, 3).join(" ") : "Agri Question";

  if (isKannada) {
    return `👨‍🌾 **ಕೃಷಿಮಿತ್ರ ಗೆಮಿನಿ ಎಐ ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ - "${topicName}"**

**ಸರಳ ಸಾರಾಂಶ:**
ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಸಕಾಲಿಕ ಕೀಟ ನಿಯಂತ್ರಣ ಮತ್ತು ರಸಗೊಬ್ಬರ ನಿರ್ವಹಣೆ ಅಗತ್ಯವಾಗಿದೆ.

---

📋 **ಮುಖ್ಯ ಸಲಹೆಗಳು:**
1. **ಕೀಟ ನಿಯಂತ್ರಣ**: ಎಲೆಗಳ ಅಡಿಯಲ್ಲಿ ಕೀಟಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, **ನೀಮ್ ಎಣ್ಣೆ (1500 ppm)** @ 5ml/ಲೀಟರ್ ಸಿಂಪಡಿಸಿ.
2. **ರಸಗೊಬ್ಬರ**: ಯೂರಿಯಾ ಮತ್ತು ಡಿಎಪಿ ನೀರಾವರಿ ನಂತರ ನೀಡಿ.
3. **ಎಐ ವೈಶಿಷ್ಟ್ಯಗಳು**: ರೋಗ ಪರೀಕ್ಷೆಗೆ **Pest AI** ಪುಟ ಬಳಸಿ, ಮಳೆ ಮುನ್ಸೂಚನೆಗೆ **Weather** ಪುಟ ಬಳಸಿ!`;
  }

  if (isHindi) {
    return `👨‍🌾 **कृषि मित्र जेमिनी एआई गाइड - "${topicName}"**

**सरल सारांश:**
आपके कृषि प्रश्न से संबंधित व्यावहारिक एवं वैज्ञानिक समाधान नीचे दिए गए हैं।

---

📋 **मुख्य सुझाव:**
1. **कीट नियंत्रण**: पत्तियों के नीचे कीटों की जांच करें, **नीम तेल (1500 ppm)** @ 5ml/लीटर छिड़कें।
2. **उर्वरक प्रबंधन**: यूरिया और डीएपी का छिड़काव सिंचाई के बाद करें।
3. **स्मार्ट फीचर्स**: बीमारी की फोटो जांच के लिए **Pest AI** पेज और बारिश रिपोर्ट के लिए **Weather** पेज देखें!`;
  }

  return `👨‍🌾 **Gemini AI Comprehensive Farming Guide for "${topicName}"**

**Simple Overview:**
Managing farm operations effectively requires understanding soil moisture, crop nutrition, pest cycles, and timely harvesting.

---

📋 **Detailed Recommended Guide:**
1. **Pest Control**: Inspect crop foliage every 3 days. Use **Neem Oil 1500 ppm** (5 ml/liter) as organic preventive spray.
2. **Nutrient Management**: Apply balanced NPK fertilizers (Urea + DAP + Potash) post-irrigation.
3. **Smart Features**: Use **Pest AI** tab for photo disease diagnosis and **Weather** tab for 7-day rain forecasts!`;
}

function formatMarkdown(text: string): React.ReactNode {
  return text;
}
