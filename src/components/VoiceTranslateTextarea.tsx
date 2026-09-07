import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Languages,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { translateToEnglish } from "@/lib/translation.service";
import { useTranslation } from "react-i18next";
import { saveOfflineMedia } from "@/lib/offline-media-store";

interface VoiceTranslateTextareaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  onAudioRecorded?: (blob: Blob, mediaId: string) => void;
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
  onAudioRecorded,
}: VoiceTranslateTextareaProps) {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [audioRecordDuration, setAudioRecordDuration] = useState(0);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<string>("auto");
  const [interimSpokenText, setInterimSpokenText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);

  // MediaRecorder refs — primary recording path, always active
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);
  const recordStartTimeRef = useRef<number>(0);

  // SpeechRecognition ref — optional parallel transcription only
  const recognitionRef = useRef<any>(null);

  const isListeningRef = useRef<boolean>(false);
  const valueRef = useRef<string>(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      setMicSupported(false);
    }
  }, []);

  const getEffectiveSpeechLang = useCallback(() => {
    if (selectedVoiceLang !== "auto") return selectedVoiceLang;
    const current = (i18n.language || "").toLowerCase();
    if (current.startsWith("hi")) return "hi-IN";
    if (current.startsWith("bn")) return "bn-IN";
    if (current.startsWith("as")) return "as-IN";
    if (current.startsWith("ne")) return "ne-NP";
    if (current.startsWith("en")) return "en-IN";
    if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
    return "en-IN";
  }, [selectedVoiceLang, i18n.language]);

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

  /**
   * Attach SpeechRecognition as a SILENT optional layer for live transcription.
   * All errors are swallowed — recognition never affects recording state.
   */
  const attachSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getEffectiveSpeechLang();
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        if (!isListeningRef.current) return;
        let interimStr = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || "";
          if (result.isFinal) {
            handleTranslateAndAppend(transcript);
            setInterimSpokenText("");
          } else {
            interimStr += transcript;
          }
        }
        if (interimStr) setInterimSpokenText(interimStr);
      };

      recognition.onend = () => {
        if (!isListeningRef.current || !recognitionRef.current) return;
        if (typeof navigator !== "undefined" && navigator.onLine) {
          try { recognition.start(); } catch { /* ignore */ }
        }
      };

      // ALL Speech API errors are silent — recording continues regardless
      recognition.onerror = (event: any) => {
        console.info("[VoiceTranslate] Speech recognition (optional):", event.error);
        if (
          event.error === "network" ||
          event.error === "service-not-allowed" ||
          event.error === "not-allowed" ||
          event.error === "audio-capture"
        ) {
          try { recognition.stop(); } catch {}
          recognitionRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      recognitionRef.current = null;
    }
  }, [getEffectiveSpeechLang, handleTranslateAndAppend]);

  /**
   * PRIMARY path: MediaRecorder always starts first — 100% offline-safe.
   * SpeechRecognition attaches in parallel for optional live transcription.
   */
  const startListening = useCallback(async () => {
    if (isListeningRef.current) return;

    if (!navigator?.mediaDevices?.getUserMedia) {
      setTranslationNotice("⚠️ Microphone not available on this device.");
      setTimeout(() => setTranslationNotice(null), 5000);
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: any) {
      const name = err?.name || "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setTranslationNotice("⚠️ Microphone access blocked — please allow mic in browser.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setTranslationNotice("⚠️ No microphone found on this device.");
      } else {
        setTranslationNotice("⚠️ Could not access microphone: " + (err?.message || "Unknown error"));
      }
      setTimeout(() => setTranslationNotice(null), 6000);
      return;
    }

    audioStreamRef.current = stream;
    audioChunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "";

    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const recordedBlob = new Blob(audioChunksRef.current, {
        type: mimeType || "audio/webm",
      });

      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }

      const durationSecs = Math.max(1, Math.round((Date.now() - recordStartTimeRef.current) / 1000));

      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }

      try {
        const mediaId = `voice_memo_${Date.now()}`;
        await saveOfflineMedia(mediaId, recordedBlob, {
          name: `${mediaId}.webm`,
          mimeType: recordedBlob.type || "audio/webm",
          size: recordedBlob.size,
        });

        const current = (valueRef.current || "").trim();
        const voiceTag = `[🎙️ Voice note (${durationSecs}s) — Stored offline]`;
        const updated = current ? `${current} ${voiceTag}` : voiceTag;
        valueRef.current = updated;
        onChange(updated);

        setTranslationNotice(`✓ Voice recording (${durationSecs}s) saved`);
        setTimeout(() => setTranslationNotice(null), 5000);

        if (onAudioRecorded) onAudioRecorded(recordedBlob, mediaId);
      } catch (storageErr) {
        console.warn("[VoiceTranslate] Offline audio save warning:", storageErr);
        setTranslationNotice(`✓ Voice recording captured (${durationSecs}s)`);
        setTimeout(() => setTranslationNotice(null), 4000);
      }

      setIsListening(false);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(250);

    recordStartTimeRef.current = Date.now();
    setAudioRecordDuration(0);
    isListeningRef.current = true;
    setIsListening(true);
    setInterimSpokenText("");

    recordTimerRef.current = setInterval(() => {
      setAudioRecordDuration(Math.round((Date.now() - recordStartTimeRef.current) / 1000));
    }, 1000);

    setTranslationNotice(
      typeof navigator !== "undefined" && navigator.onLine
        ? "🎙️ Recording… Live transcription active if available."
        : "🎙️ Recording offline voice note — speak clearly."
    );
    setTimeout(() => setTranslationNotice(null), 3500);

    // Attach SpeechRecognition as optional parallel transcription
    attachSpeechRecognition();
  }, [attachSpeechRecognition, onChange, onAudioRecorded]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
      mediaRecorderRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    setIsListening(false);
    setInterimSpokenText("");
  }, []);

  const toggleListening = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (disabled) return;
      if (isListeningRef.current) {
        stopListening();
      } else {
        await startListening();
      }
    },
    [disabled, startListening, stopListening],
  );

  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  const handleTranslateExistingText = async () => {
    const textToTranslate = value.trim();
    if (!textToTranslate) return;
    setIsTranslating(true);
    setOriginalDraft(textToTranslate);
    const res = await translateToEnglish(textToTranslate, "auto");
    setIsTranslating(false);
    if (res.success && res.translatedText) {
      onChange(res.translatedText);
      const notice =
        res.detectedLang && res.detectedLang !== "en"
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

        <div className="absolute right-2 top-2 flex flex-col gap-1.5 items-end">
          {micSupported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={toggleListening}
              className={`h-7 w-7 p-0 rounded-full shadow-sm transition-all ${
                isListening ? "animate-pulse ring-2 ring-red-400" : "bg-card hover:bg-secondary"
              }`}
              title={
                isListening
                  ? t("field_observation.stop_listening", "Stop recording")
                  : t("field_observation.start_listening", "Record voice note (works offline)")
              }
              aria-label="Toggle voice recording"
            >
              <Mic className={`h-3.5 w-3.5 ${isListening ? "text-white" : "text-primary"}`} />
            </Button>
          )}

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

      <div className="flex flex-wrap items-center justify-between gap-1 text-[0.65rem] font-mono">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isListening && (
            <Badge
              variant="destructive"
              className="animate-pulse flex items-center gap-1 px-1.5 py-0.5 text-[0.62rem] bg-red-600 text-white font-mono"
            >
              <Mic className="h-3 w-3" />
              <span>
                REC {Math.floor(audioRecordDuration / 60)}:{(audioRecordDuration % 60).toString().padStart(2, "0")}
              </span>
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

        <div className="text-muted-foreground shrink-0 text-right">
          {value.length}/{maxLength} • {t("field_observation.auto_en", "Auto English")}
        </div>
      </div>
    </div>
  );
}
