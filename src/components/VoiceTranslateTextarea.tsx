import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, Languages, RotateCcw, Loader2, WifiOff } from "lucide-react";
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

interface LanguageOption {
  code: string;
  label: string;
  speechCode: string;
}

const QUICK_LANGUAGES: LanguageOption[] = [
  { code: "hi", label: "🇮🇳 हिन्दी", speechCode: "hi-IN" },
  { code: "en", label: "🇬🇧 English", speechCode: "en-IN" },
  { code: "bn", label: "বাংলা", speechCode: "bn-IN" },
  { code: "ne", label: "नेपाली", speechCode: "ne-NP" },
  { code: "as", label: "অসমীয়া", speechCode: "as-IN" },
];

const EXTRA_LANGUAGES: LanguageOption[] = [
  { code: "mr", label: "मराठी (Marathi)", speechCode: "mr-IN" },
  { code: "gu", label: "ગુજરાતી (Gujarati)", speechCode: "gu-IN" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", speechCode: "pa-IN" },
  { code: "ta", label: "தமிழ் (Tamil)", speechCode: "ta-IN" },
  { code: "te", label: "తెలుగు (Telugu)", speechCode: "te-IN" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)", speechCode: "kn-IN" },
  { code: "ml", label: "മലയാളം (Malayalam)", speechCode: "ml-IN" },
  { code: "ur", label: "اردو (Urdu)", speechCode: "ur-IN" },
];

const ALL_LANGUAGES = [...QUICK_LANGUAGES, ...EXTRA_LANGUAGES];

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
  const [isOfflineRecording, setIsOfflineRecording] = useState(false);
  const [audioRecordDuration, setAudioRecordDuration] = useState(0);
  const [interimSpeech, setInterimSpeech] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  // Default to Hindi (hi-IN) for India field operations, or active app locale if Indic
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    const current = (i18n?.language || "").toLowerCase();
    if (current.startsWith("bn")) return "bn";
    if (current.startsWith("ne")) return "ne";
    if (current.startsWith("as")) return "as";
    if (current.startsWith("hi")) return "hi";
    return "hi";
  });

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);
  const recordStartRef = useRef<number>(0);
  const isListeningRef = useRef(false);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const showNotice = useCallback((msg: string, ms = 5000) => {
    setNotice(msg);
    if (ms > 0) setTimeout(() => setNotice(null), ms);
  }, []);

  const activeLangConfig: LanguageOption =
    ALL_LANGUAGES.find((l) => l.code === selectedLang) || QUICK_LANGUAGES[0]!;

  // ─── Google Translate Engine (translates recognized text to English) ────────
  const handleTranslateAndAppend = useCallback(
    async (spokenText: string) => {
      const trimmed = spokenText.trim();
      if (!trimmed) return;

      setIsTranslating(true);
      try {
        const res = await translateToEnglish(trimmed, activeLangConfig.code);
        const translated = (res.translatedText || trimmed).trim();
        if (translated) {
          const current = (valueRef.current || "").trim();
          const updated = current ? `${current} ${translated}` : translated;
          valueRef.current = updated;
          onChange(updated);
          showNotice(
            activeLangConfig.code !== "en"
              ? `✓ Translated from ${activeLangConfig.label} → English`
              : "✓ Transcribed in English"
          );
        }
      } catch (err) {
        console.warn("[VoiceTranslate] Translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    },
    [activeLangConfig, onChange, showNotice]
  );

  // ─── Online Live Speech Recognition (Google Translate mode) ─────────────────
  const startOnlineSpeechRecognition = useCallback(() => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      // Browser doesn't have Web Speech API — switch to offline audio recording
      startOfflineAudioRecording();
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = activeLangConfig.speechCode; // e.g. hi-IN, en-IN
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        if (!isListeningRef.current) return;
        let interimStr = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcript = res[0]?.transcript || "";
          if (res.isFinal) {
            if (transcript.trim()) {
              setInterimSpeech("");
              handleTranslateAndAppend(transcript.trim());
            }
          } else {
            interimStr += transcript;
          }
        }
        if (interimStr) {
          setInterimSpeech(interimStr);
        }
      };

      recognition.onerror = (event: any) => {
        console.info("[VoiceTranslate] Speech event:", event.error);
        if (event.error === "no-speech") return; // Normal pause, ignore
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          showNotice("⚠️ Microphone access denied — allow microphone in browser.");
          stopListening();
        } else if (event.error === "network") {
          // Google speech servers unreachable on this network — fallback to offline recording
          showNotice("⚠️ Speech recognition offline — recording voice memo.");
          stopListening();
          startOfflineAudioRecording();
        }
      };

      recognition.onend = () => {
        // Auto-restart if user has not manually clicked Stop
        if (isListeningRef.current && isOnline) {
          try {
            recognition.start();
          } catch {
            /* ignore restart collisions */
          }
        } else {
          setIsListening(false);
          setInterimSpeech("");
        }
      };

      recognitionRef.current = recognition;
      isListeningRef.current = true;
      setIsListening(true);
      setIsOfflineRecording(false);
      recognition.start();
      showNotice(`🎙️ Listening in ${activeLangConfig.label}… speak clearly.`);
    } catch (err) {
      console.warn("[VoiceTranslate] Recognition start failed:", err);
      startOfflineAudioRecording();
    }
  }, [activeLangConfig, handleTranslateAndAppend, isOnline, showNotice]);

  // ─── Offline Audio Recording (MediaRecorder + IndexedDB) ────────────────────
  const startOfflineAudioRecording = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      showNotice("⚠️ Microphone not supported on this browser.");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      showNotice("⚠️ Microphone access denied.");
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
      if (e.data?.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;

      const durationSecs = Math.max(1, Math.round((Date.now() - recordStartRef.current) / 1000));
      const blob = new Blob(audioChunksRef.current, { type: mimeType || "audio/webm" });

      // Save to IndexedDB for offline submission
      try {
        const mediaId = `voice_memo_${Date.now()}`;
        await saveOfflineMedia(mediaId, blob, {
          name: `${mediaId}.webm`,
          mimeType: blob.type,
          size: blob.size,
        });
        if (onAudioRecorded) onAudioRecorded(blob, mediaId);
      } catch {}

      // Append offline note tag
      const current = (valueRef.current || "").trim();
      const tag = `[🎙️ Voice note (${durationSecs}s) — Stored offline]`;
      const updated = current ? `${current} ${tag}` : tag;
      valueRef.current = updated;
      onChange(updated);
      showNotice(`✓ Voice note (${durationSecs}s) saved to report`);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(250);
    recordStartRef.current = Date.now();
    setAudioRecordDuration(0);
    isListeningRef.current = true;
    setIsListening(true);
    setIsOfflineRecording(true);

    recordTimerRef.current = setInterval(() => {
      setAudioRecordDuration(Math.round((Date.now() - recordStartRef.current) / 1000));
    }, 1000);

    showNotice("🎙️ Recording voice note offline…");
  }, [onAudioRecorded, onChange, showNotice]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    clearInterval(recordTimerRef.current);
    recordTimerRef.current = null;
    setInterimSpeech("");
    setIsListening(false);
    setIsOfflineRecording(false);
  }, []);

  const toggle = useCallback(async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (disabled || isTranslating) return;

    if (isListeningRef.current) {
      stopListening();
    } else {
      // If online: use Google Translate speech recognition
      // If offline: use offline voice recording
      if (isOnline) {
        startOnlineSpeechRecognition();
      } else {
        await startOfflineAudioRecording();
      }
    }
  }, [disabled, isTranslating, isOnline, startOnlineSpeechRecognition, startOfflineAudioRecording, stopListening]);

  useEffect(() => () => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    audioStreamRef.current?.getTracks().forEach((t) => t.stop());
    clearInterval(recordTimerRef.current);
  }, []);

  // ─── Translate typed text button ──────────────────────────────────────────
  const handleTranslateTyped = async () => {
    if (!value.trim()) return;
    setIsTranslating(true);
    setOriginalDraft(value.trim());
    const res = await translateToEnglish(value.trim(), selectedLang || "auto");
    setIsTranslating(false);
    if (res.success && res.translatedText) {
      onChange(res.translatedText);
      showNotice(
        res.detectedLang && res.detectedLang !== "en"
          ? `✓ Translated from ${res.detectedLang.toUpperCase()} → English`
          : "✓ Already in English"
      );
    }
  };

  const handleRevert = () => {
    if (originalDraft !== null) {
      onChange(originalDraft);
      setOriginalDraft(null);
      showNotice("Reverted to original text", 3000);
    }
  };

  return (
    <div className="grid gap-1.5 text-left">
      {/* Header with Quick Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <Label
          htmlFor={id}
          className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5"
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          <span>{label || t("field_observation.notes_label", "Field Notes & Description")}</span>
        </Label>

        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[0.62rem] font-mono text-muted-foreground mr-0.5">
            Voice:
          </span>
          {QUICK_LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              disabled={isListening || disabled}
              onClick={() => setSelectedLang(l.code)}
              className={`text-[0.68rem] px-2 py-0.5 rounded transition-all cursor-pointer font-sans ${
                selectedLang === l.code
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50"
              }`}
            >
              {l.label}
            </button>
          ))}

          <select
            value={QUICK_LANGUAGES.some((q) => q.code === selectedLang) ? "" : selectedLang}
            onChange={(e) => {
              if (e.target.value) setSelectedLang(e.target.value);
            }}
            disabled={isListening || disabled}
            aria-label="More voice languages"
            className="bg-secondary/60 border border-border/50 rounded px-1 py-0.5 text-[0.65rem] font-sans text-muted-foreground cursor-pointer focus:outline-none"
          >
            <option value="" disabled>More…</option>
            {EXTRA_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Textarea with Action Buttons */}
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
              `Speak in ${activeLangConfig.label} or type in any language — auto-translates to English…`,
            )
          }
          className="min-h-[85px] bg-secondary/40 border-border font-sans text-xs pr-20 resize-y focus-visible:ring-1 focus-visible:ring-primary"
        />

        <div className="absolute right-2 top-2 flex flex-col gap-1.5 items-end">
          {/* Microphone button */}
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            disabled={disabled || isTranslating}
            onClick={toggle}
            className={`h-7 w-7 p-0 rounded-full shadow-sm transition-all ${
              isListening ? "animate-pulse ring-2 ring-red-400" : "bg-card hover:bg-secondary"
            }`}
            title={
              isListening
                ? "Stop recording"
                : isOnline
                ? `Speak in ${activeLangConfig.label} (Google Translate live voice)`
                : "Record voice note offline"
            }
            aria-label="Toggle voice recording"
          >
            {isTranslating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <Mic className={`h-3.5 w-3.5 ${isListening ? "text-white" : "text-primary"}`} />
            )}
          </Button>

          {/* Translate typed text button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isTranslating || !value.trim()}
            onClick={handleTranslateTyped}
            className="h-7 w-7 p-0 rounded-full bg-card hover:bg-secondary shadow-sm"
            title="Translate typed text to English (Google Translate)"
            aria-label="Translate"
          >
            {isTranslating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <Languages className="h-3.5 w-3.5 text-primary" />
            )}
          </Button>

          {/* Revert original button */}
          {originalDraft !== null && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRevert}
              className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-foreground"
              title="Revert to original"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Live Speech Recognition Bubble (Google Translate style live feedback) */}
      {isListening && interimSpeech && (
        <div className="bg-primary/10 border border-primary/20 rounded px-2 py-1 text-xs text-primary flex items-center gap-1.5 animate-pulse">
          <span className="font-semibold text-[0.68rem] uppercase font-mono">
            {activeLangConfig.label}:
          </span>
          <span className="italic truncate font-sans">"{interimSpeech}"</span>
        </div>
      )}

      {/* Footer Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[0.65rem] font-mono">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isListening && (
            <Badge
              variant="destructive"
              className="animate-pulse flex items-center gap-1 px-1.5 py-0.5 text-[0.62rem] bg-red-600 text-white"
            >
              <Mic className="h-3 w-3" />
              <span>
                {isOfflineRecording
                  ? `REC ${Math.floor(audioRecordDuration / 60)}:${(audioRecordDuration % 60)
                      .toString()
                      .padStart(2, "0")} • OFFLINE`
                  : `LIVE • ${activeLangConfig.label}`}
              </span>
            </Badge>
          )}

          {!isOnline && (
            <Badge variant="outline" className="text-amber-500 border-amber-500/40 text-[0.62rem] flex items-center gap-1">
              <WifiOff className="h-2.5 w-2.5" />
              <span>Offline Mode</span>
            </Badge>
          )}

          {isTranslating && (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>{t("field_observation.translating_to_en", "Translating to English…")}</span>
            </span>
          )}

          {notice && (
            <span className="text-emerald-500 font-semibold truncate max-w-xs">{notice}</span>
          )}
        </div>

        <div className="text-muted-foreground shrink-0">
          {value.length}/{maxLength} • {t("field_observation.auto_en", "Google Translate")}
        </div>
      </div>
    </div>
  );
}
