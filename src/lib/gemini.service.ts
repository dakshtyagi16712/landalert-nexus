/**
 * src/lib/gemini.service.ts
 * =========================
 * Cloud AI Audio & Text Translation Service using Google Gemini Flash.
 *
 * Supports direct audio-to-English translation from any Indian regional language
 * (Hindi, Bengali, Nepali, Assamese, Meitei, etc.) with state-of-the-art accuracy.
 */

const DEFAULT_GEMINI_KEY =
  (typeof import.meta !== "undefined" && (import.meta.env as any)?.["VITE_GEMINI_API_KEY"]) ||
  (typeof process !== "undefined" && ((process.env as any)?.["GEMINI_API_KEY"] || (process.env as any)?.["VITE_GEMINI_API_KEY"])) ||
  "";

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
];

/**
 * Converts a Blob into base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64 || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Transcribe & translate recorded audio directly to English using Gemini Flash.
 */
export async function translateAudioWithGemini(
  audioBlob: Blob,
  hintLang?: string
): Promise<{ success: boolean; text: string; error?: string }> {
  const apiKey = DEFAULT_GEMINI_KEY;
  if (!apiKey) {
    return { success: false, text: "", error: "No Gemini API key available" };
  }

  try {
    const base64Audio = await blobToBase64(audioBlob);
    if (!base64Audio) {
      return { success: false, text: "", error: "Audio conversion failed" };
    }

    const mimeType = audioBlob.type || "audio/webm";
    const cleanMime = mimeType.split(";")[0] || "audio/webm";

    const prompt =
      `You are an expert emergency translator for India's National Landslide Monitoring Network (LandAlert-Nexus). ` +
      `Listen to this voice recording from a field officer or local resident.${hintLang ? ` The spoken language may be ${hintLang}.` : ""} ` +
      `Transcribe what was said and translate it into clear, accurate, natural English. ` +
      `Preserve all geographical details, road names, hazard descriptions, and severity. ` +
      `Output ONLY the final English translation. Do not include quotes, greetings, markdown formatting, or preamble.`;

    // Try primary and fallback models
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 18000);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: cleanMime,
                      data: base64Audio,
                    },
                  },
                  { text: prompt },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
            },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!res.ok) {
          continue;
        }

        const data = await res.json();
        const output = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (output && output.length > 0) {
          return { success: true, text: output };
        }
      } catch {
        // Try next model
      }
    }

    return { success: false, text: "", error: "Gemini models unresponsive" };
  } catch (err: any) {
    return { success: false, text: "", error: err?.message || "Audio translation failed" };
  }
}

/**
 * Translate typed text into English using Gemini Flash.
 */
export async function translateTextWithGemini(
  text: string,
  sourceLangHint?: string
): Promise<{ success: boolean; text: string; error?: string }> {
  const apiKey = DEFAULT_GEMINI_KEY;
  const trimmed = text.trim();
  if (!trimmed) return { success: true, text: "" };

  const prompt =
    `Translate the following landslide field observation text into clear, fluent, professional English. ` +
    (sourceLangHint && sourceLangHint !== "auto" ? `Source language: ${sourceLangHint}. ` : "") +
    `Preserve all names of places, roads, and hazard conditions accurately. ` +
    `Return ONLY the translated English text, with no extra commentary, no quotes:\n\n${trimmed}`;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) continue;

      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (output) {
        return { success: true, text: output };
      }
    } catch {
      // Try next model
    }
  }

  return { success: false, text: trimmed, error: "Text translation failed" };
}
