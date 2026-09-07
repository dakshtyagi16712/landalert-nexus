/**
 * src/lib/translation.service.ts
 * ==============================
 * Real-time translation service for LandAlert-Nexus.
 * Translates spoken or typed text from any Indic/regional language
 * (Hindi, Bengali, Assamese, Nepali, Meitei, Mizo, Khasi, Garo, etc.)
 * into English in real time.
 */

export interface TranslationResult {
  translatedText: string;
  originalText: string;
  detectedLang?: string;
  sourceLang?: string;
  success: boolean;
  error?: string;
}

// Basic offline dictionary for common landslide and disaster hazard terms
const OFFLINE_TERMS: Record<string, string> = {
  "पहिरो": "landslide",
  "भूमिधस": "landslide",
  "भूस्खलन": "landslide",
  "धस": "subsidence / slump",
  "माटो": "soil / mud",
  "ढुङ्गा": "rock / stones",
  "पत्थर": "rock / stones",
  "पानी": "water / rainfall",
  "वर्षा": "rainfall",
  "सड़क": "road",
  "बाटो": "road",
  "बन्द": "blocked",
  "दरार": "crack / fissure",
  "খহনীয়া": "landslide / erosion",
  "भूमिধ্বস": "landslide",
  "পাহাড়": "mountain / slope",
  "বৃষ্টি": "rain",
  "রাস্তা": "road",
  "বন্ধ": "blocked",
};

/**
 * Translates given text into English.
 * 1. Direct browser-to-Google Translate (avoids Render datacenter IP rate limits & latency)
 * 2. Falls back to backend `/api/translate` endpoint if browser fetch fails
 * 3. Falls back to offline dictionary if completely offline
 */
export async function translateToEnglish(
  text: string,
  sourceLang: string = "auto",
): Promise<TranslationResult> {
  const trimmed = text?.trim();
  if (!trimmed) {
    return {
      translatedText: "",
      originalText: "",
      detectedLang: "en",
      success: true,
    };
  }

  const isPureAscii = /^[\x00-\x7F]*$/.test(trimmed);
  const sl = sourceLang && sourceLang !== "auto" ? (sourceLang.split("-")[0] || "auto").toLowerCase() : "auto";

  // 1. Direct client-side Google Translate public API (Fastest: <100ms from user's IP, bypasses Render)
  try {
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sl,
    )}&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const gtxRes = await fetch(gtxUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (gtxRes.ok) {
      const gtxData = await gtxRes.json();
      let translated = "";
      if (Array.isArray(gtxData[0])) {
        translated = gtxData[0]
          .map((chunk: any) => chunk[0])
          .filter(Boolean)
          .join("");
      }
      if (translated && translated.trim()) {
        return {
          translatedText: translated.trim(),
          originalText: trimmed,
          detectedLang: gtxData[2] || sl,
          success: true,
        };
      }
    }
  } catch {
    // Direct client fetch failed or timed out — proceed to backend proxy fallback
  }

  // 2. Fallback to `/api/translate` backend proxy
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: trimmed,
        sourceLang: sl,
        targetLang: "en",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.translatedText && data.translatedText !== trimmed) {
        return {
          translatedText: data.translatedText.trim(),
          originalText: trimmed,
          detectedLang: data.detectedLang || sl,
          success: true,
        };
      }
    }
  } catch {
    // Both network endpoints unavailable — proceed to offline fallback
  }

  // 3. Offline heuristic dictionary fallback
  let offlineTranslated = trimmed;
  let replaced = false;
  for (const [indicWord, engWord] of Object.entries(OFFLINE_TERMS)) {
    if (offlineTranslated.includes(indicWord)) {
      offlineTranslated = offlineTranslated.split(indicWord).join(`[${engWord}]`);
      replaced = true;
    }
  }

  return {
    translatedText: replaced ? offlineTranslated : trimmed,
    originalText: trimmed,
    detectedLang: isPureAscii ? "en" : "indic_offline",
    success: true,
    error: "Used offline fallback",
  };
}
