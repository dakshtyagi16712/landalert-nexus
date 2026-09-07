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
  "ভূমিধ্বস": "landslide",
  "পাহাড়": "mountain / slope",
  "বৃষ্টি": "rain",
  "রাস্তা": "road",
  "বন্ধ": "blocked",
};

/**
 * Translates given text into English.
 * 1. Tries local backend endpoint `/api/translate`
 * 2. Falls back to direct Google Translate public client API
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

  // If text is purely ASCII letters, numbers, and basic punctuation with no non-English words,
  // it might already be English, but we still allow translation if specifically requested.
  const isPureAscii = /^[\x00-\x7F]*$/.test(trimmed);

  const sl = sourceLang && sourceLang !== "auto" ? (sourceLang.split("-")[0] || "auto").toLowerCase() : "auto";

  // 1. Try internal `/api/translate` endpoint
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
      if (data.success && data.translatedText) {
        return {
          translatedText: data.translatedText,
          originalText: trimmed,
          detectedLang: data.detectedLang || sl,
          success: true,
        };
      }
    }
  } catch {
    // Network error or offline - proceed to client fallback
  }

  // 2. Direct client-side Google Translate public endpoint fallback
  try {
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sl,
    )}&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`;

    const gtxRes = await fetch(gtxUrl);
    if (gtxRes.ok) {
      const gtxData = await gtxRes.json();
      let translated = "";
      if (Array.isArray(gtxData[0])) {
        translated = gtxData[0]
          .map((chunk: any) => chunk[0])
          .filter(Boolean)
          .join("");
      }
      if (translated) {
        return {
          translatedText: translated,
          originalText: trimmed,
          detectedLang: gtxData[2] || sourceLang,
          success: true,
        };
      }
    }
  } catch {
    // Both endpoints unavailable, proceed to offline fallback
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
