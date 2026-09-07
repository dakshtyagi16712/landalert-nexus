import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Languages,
  RotateCcw,
  Loader2,
  Check,
  Volume2,
  Sparkles,
} from "lucide-react";
import { translateToEnglish } from "@/lib/translation.service";
import { useTranslation } from "react-i18next";

interface VoiceTranslateTextareaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

const SUPPORTED_VOICE_LANGUAGES = [
  { code: "auto", name: "🌐 Auto / Current App Language", speechCode: "" },
  { code: "hi-IN", name: "🇮🇳 Hindi (हिन्दी)", speechCode: "hi-IN" },
  { code: "bn-IN", name: "🇮🇳 Bengali (বাংলা)", speechCode: "bn-IN" },
  { code: "as-IN", name: "🇮🇳 Assamese (অসমীয়া)", speechCode: "as-IN" },
  { code: "ne-NP", name: "🇮🇳 Nepali (नेपाली)", speechCode: "ne-NP" },
  { code: "en-IN", name: "🇮🇳 English (India)", speechCode: "en-IN" },
  { code: "en-US", name: "🇬🇧 English (Global)", speechCode: "en-US" },
];

export function VoiceTranslateTextarea({
  id = "fieldNotesInput",
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  maxLength = 1000,
}: VoiceTranslateTextareaProps) {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<string>("auto");
  const [interimSpokenText, setInterimSpokenText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const userManuallyStoppedRef = useRef<boolean>(false);
  const restartTimeoutRef = useRef<any>(null);
  const valueRef = useRef<string>(value);

  // Keep valueRef synchronized to prevent stale closures in async speech events
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRec) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Map app locale to default speech recognition language
  const getEffectiveSpeechLang = useCallback(() => {
    if (selectedVoiceLang !== "auto") return selectedVoiceLang;
    const current = (i18n.language || "").toLowerCase();
    if (current.startsWith("hi")) return "hi-IN";
    if (current.startsWith("bn")) return "bn-IN";
    if (current.startsWith("as")) return "as-IN";
    if (current.startsWith("ne")) return "ne-NP";
    if (current.startsWith("en")) return "en-IN";

    // Check browser navigator language
    if (typeof navigator !== "undefined" && navigator.language) {
      return navigator.language;
    }
    return "en-IN";
  }, [selectedVoiceLang, i18n.language]);

  // Translate spoken or typed chunk and append to English text box
  const handleTranslateAndAppend = useCallback(
    async (spokenText: string) => {
      if (!spokenText.trim()) return;
      setIsTranslating(true);

      const langCode = getEffectiveSpeechLang();
      const res = await translateToEnglish(spokenText, langCode.split("-")[0]);

      setIsTranslating(false);
      const translated = res.translatedText.trim();

      if (translated) {
        const current = (valueRef.current || "").trim();
        const updated = current ? `${current} ${translated}` : translated;
        valueRef.current = updated;
        onChange(updated);

        const langNotice =
          res.detectedLang && res.detectedLang !== "en"
            ? `✓ Translated from ${res.detectedLang.toUpperCase()} → English`
            : `✓ Transcribed in English`;
        setTranslationNotice(langNotice);
        setTimeout(() => setTranslationNotice(null), 4000);
      }
    },
    [getEffectiveSpeechLang, onChange],
  );

  const stopListening = useCallback(() => {
    userManuallyStoppedRef.current = true;
    isListeningRef.current = false;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimSpokenText("");
  }, []);

  const startListening = useCallback(async () => {
    if (typeof window === "undefined") return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
      setTranslationNotice("⚠️ Speech recognition not supported in this browser. Please type and use Translate.");
      return;
    }

    // Explicitly prompt / verify microphone permission via getUserMedia first.
    // In Chromium and Safari, calling SpeechRecognition directly without granted permission
    // causes the engine to immediately abort and fire onend/onerror silently.
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release the test tracks immediately so SpeechRecognition has clean exclusive hardware access
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn("[VoiceTranslate] Mic permission error:", err);
        isListeningRef.current = false;
        setIsListening(false);
        if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
          setTranslationNotice("⚠️ Microphone access blocked. Please allow mic in browser address bar.");
        } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
          setTranslationNotice("⚠️ No microphone device detected.");
        } else {
          setTranslationNotice("⚠️ Could not access microphone: " + (err?.message || "Permission required"));
        }
        setTimeout(() => setTranslationNotice(null), 6000);
        return;
      }
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getEffectiveSpeechLang();
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setInterimSpokenText("");
        setTranslationNotice(null);
      };

      recognition.onresult = (event: any) => {
        let interimStr = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || "";
          if (result.isFinal) {
            // Translate final chunk to English and append to text box
            handleTranslateAndAppend(transcript);
            setInterimSpokenText("");
          } else {
            interimStr += transcript;
          }
        }
        if (interimStr) {
          setInterimSpokenText(interimStr);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("[SpeechRecognition] error event:", event.error);
        if (event.error === "no-speech") {
          // Simply silence or pause; do not terminate the session
          return;
        }

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          userManuallyStoppedRef.current = true;
          isListeningRef.current = false;
          setIsListening(false);
          setTranslationNotice("⚠️ Microphone access blocked. Please allow mic in browser address bar.");
          setTimeout(() => setTranslationNotice(null), 6000);
        } else if (event.error === "audio-capture") {
          userManuallyStoppedRef.current = true;
          isListeningRef.current = false;
          setIsListening(false);
          setTranslationNotice("⚠️ Microphone busy or not connected.");
          setTimeout(() => setTranslationNotice(null), 6000);
        } else if (event.error === "network") {
          userManuallyStoppedRef.current = true;
          isListeningRef.current = false;
          setIsListening(false);
          setTranslationNotice("⚠️ Speech service network error. You can type and use 🌐 Translate.");
          setTimeout(() => setTranslationNotice(null), 6000);
        }
      };

      recognition.onend = () => {
        // Web Speech API triggers onend on any pause or phrase completion.
        // If user did NOT explicitly click stop, automatically restart after 150ms to keep listening continuously.
        if (isListeningRef.current && !userManuallyStoppedRef.current) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (isListeningRef.current && !userManuallyStoppedRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.warn("[SpeechRecognition] Auto-restart warning:", err);
              }
            }
          }, 150);
          return;
        }

        setIsListening(false);
        isListeningRef.current = false;
        setInterimSpokenText("");
      };

      userManuallyStoppedRef.current = false;
      isListeningRef.current = true;
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn("[SpeechRecognition] Start failed:", err);
      isListeningRef.current = false;
      setIsListening(false);
      setTranslationNotice("⚠️ Could not start voice typing: " + (err?.message || "Unknown error"));
      setTimeout(() => setTranslationNotice(null), 5000);
    }
  }, [getEffectiveSpeechLang, handleTranslateAndAppend]);

  // Toggle speech recognition
  const toggleSpeechRecognition = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (disabled) return;

      if (isListeningRef.current) {
        stopListening();
        return;
      }

      await startListening();
    },
    [disabled, startListening, stopListening],
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      userManuallyStoppedRef.current = true;
      isListeningRef.current = false;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // 1-Click translate typed text to English
  const handleTranslateExistingText = async () => {
    const textToTranslate = value.trim();
    if (!textToTranslate) return;

    setIsTranslating(true);
    setOriginalDraft(textToTranslate);

    const res = await translateToEnglish(textToTranslate, "auto");
    setIsTranslating(false);

    if (res.success && res.translatedText) {
      onChange(res.translatedText);
      const notice = res.detectedLang && res.detectedLang !== "en"
        ? `✓ Translated from ${res.detectedLang.toUpperCase()} → English`
        : `✓ Already in English`;
      setTranslationNotice(notice);
      setTimeout(() => setTranslationNotice(null), 4000);
    }
  };

  const handleRevertOriginal = () => {
    if (originalDraft !== null) {
      onChange(originalDraft);
      setOriginalDraft(null);
      setTranslationNotice("Reverted to original text");
      setTimeout(() => setTranslationNotice(null), 3000);
    }
  };

  return (
    <div className="grid gap-1.5 text-left">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5"
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          <span>{label || t("field_observation.notes_label", "Field Notes & Description")}</span>
        </Label>

        <div className="flex items-center gap-1.5 text-[0.68rem] font-mono">
          {/* Spoken Language Picker */}
          <select
            value={selectedVoiceLang}
            onChange={(e) => setSelectedVoiceLang(e.target.value)}
            disabled={isListening || disabled}
            aria-label="Voice input language"
            className="bg-secondary/50 border border-border rounded px-1.5 py-0.5 text-[0.68rem] font-sans text-foreground cursor-pointer focus:outline-none"
            title="Select the language you will speak or type in"
          >
            {SUPPORTED_VOICE_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          disabled={disabled}
          placeholder={
            placeholder ||
            t(
              "field_observation.notes_placeholder",
              "Speak or type in any language (Hindi, Bengali, Nepali, etc.) — words will be translated to English in real time…",
            )
          }
          className="min-h-[85px] bg-secondary/40 border-border font-sans text-xs pr-20 resize-y focus-visible:ring-1 focus-visible:ring-primary"
        />

        {/* Right side floating action buttons (Mic & Translate) */}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5 items-end">
          {/* Audio Mic Button */}
          {speechSupported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={toggleSpeechRecognition}
              className={`h-7 w-7 p-0 rounded-full shadow-sm transition-all ${
                isListening ? "animate-pulse ring-2 ring-red-400" : "bg-card hover:bg-secondary"
              }`}
              title={
                isListening
                  ? t("field_observation.stop_listening", "Stop audio voice typing")
                  : t("field_observation.start_listening", "Speak to type & translate to English")
              }
              aria-label="Toggle voice typing and live translation"
            >
              {isListening ? (
                <Mic className="h-3.5 w-3.5 text-white" />
              ) : (
                <Mic className="h-3.5 w-3.5 text-primary" />
              )}
            </Button>
          )}

          {/* Instant Translate to English button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isTranslating || !value.trim()}
            onClick={handleTranslateExistingText}
            className="h-7 w-7 p-0 rounded-full bg-card hover:bg-secondary shadow-sm"
            title={t("field_observation.translate_to_english", "Translate text to English")}
            aria-label="Translate text to English"
          >
            {isTranslating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <Languages className="h-3.5 w-3.5 text-primary" />
            )}
          </Button>

          {/* Undo Revert button if translated */}
          {originalDraft !== null && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRevertOriginal}
              className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-foreground"
              title={t("field_observation.revert_original", "Show original text before translation")}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Real-time status / Interim speech indicators */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[0.65rem] font-mono">
        {/* Active Speech / Translation badge */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isListening && (
            <Badge
              variant="destructive"
              className="animate-pulse flex items-center gap-1 px-1.5 py-0.5 text-[0.62rem]"
            >
              <Mic className="h-3 w-3" />
              <span>{t("field_observation.listening", "Listening… Speak in any language")}</span>
            </Badge>
          )}

          {interimSpokenText && (
            <span className="text-primary truncate italic max-w-xs">
              "{interimSpokenText}"
            </span>
          )}

          {isTranslating && (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>{t("field_observation.translating_to_en", "Translating to English…")}</span>
            </span>
          )}

          {translationNotice && (
            <span className="text-emerald-500 font-semibold">{translationNotice}</span>
          )}
        </div>

        {/* Character counter & translation hint */}
        <div className="text-muted-foreground shrink-0 text-right">
          {value.length}/{maxLength} • {t("field_observation.auto_en", "Auto English")}
        </div>
      </div>
    </div>
  );
}
