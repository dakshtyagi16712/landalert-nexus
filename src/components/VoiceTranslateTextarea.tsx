import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, Languages, RotateCcw, Loader2 } from "lucide-react";
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
  whisperLang: string;
}

const QUICK_LANGUAGES: LanguageOption[] = [
  { code: "hi", label: "🇮🇳 हिन्दी", speechCode: "hi-IN", whisperLang: "hi" },
  { code: "en", label: "🇬🇧 English", speechCode: "en-IN", whisperLang: "en" },
  { code: "bn", label: "বাংলা", speechCode: "bn-IN", whisperLang: "bn" },
  { code: "ne", label: "नेपाली", speechCode: "ne-NP", whisperLang: "ne" },
  { code: "as", label: "অসমীয়া", speechCode: "as-IN", whisperLang: "as" },
];

const EXTRA_LANGUAGES: LanguageOption[] = [
  { code: "mr", label: "मराठी (Marathi)", speechCode: "mr-IN", whisperLang: "mr" },
  { code: "gu", label: "ગુજરાતી (Gujarati)", speechCode: "gu-IN", whisperLang: "gu" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", speechCode: "pa-IN", whisperLang: "pa" },
  { code: "ta", label: "தமிழ் (Tamil)", speechCode: "ta-IN", whisperLang: "ta" },
  { code: "te", label: "తెలుగు (Telugu)", speechCode: "te-IN", whisperLang: "te" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)", speechCode: "kn-IN", whisperLang: "kn" },
  { code: "ml", label: "മലയാളം (Malayalam)", speechCode: "ml-IN", whisperLang: "ml" },
  { code: "ur", label: "اردو (Urdu)", speechCode: "ur-IN", whisperLang: "ur" },
];

const ALL_LANGUAGES = [...QUICK_LANGUAGES, ...EXTRA_LANGUAGES];

// ─── Singleton Whisper pipeline (loaded on-demand, cached in browser) ────────
let _whisperPipeline: any = null;
let _whisperLoadPromise: Promise<any> | null = null;

async function getWhisperPipeline(onProgress?: (msg: string) => void): Promise<any> {
  if (_whisperPipeline) return _whisperPipeline;
  if (_whisperLoadPromise) return _whisperLoadPromise;

  _whisperLoadPromise = (async () => {
    try {
      onProgress?.("⏳ Loading AI speech model…");
      const { pipeline, env } = await import("@xenova/transformers");
      env.backends.onnx.wasm.proxy = false;
      env.backends.onnx.wasm.numThreads = 1; // Works without SharedArrayBuffer / COOP headers
      env.useBrowserCache = true;
      env.allowLocalModels = false;

      const pipe = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny",
        {
          progress_callback: (p: any) => {
            if (p?.loaded != null && p?.total) {
              const pct = Math.round((p.loaded / p.total) * 100);
              onProgress?.(`⏳ Loading model… ${pct}%`);
            }
          },
        }
      );
      _whisperPipeline = pipe;
      onProgress?.("✓ Model ready");
      return pipe;
    } catch (e) {
      _whisperLoadPromise = null;
      throw e;
    }
  })();

  return _whisperLoadPromise;
}

// ─── Audio blob → 16 kHz Float32Array (required by Whisper) ─────────────────
async function blobToFloat32(blob: Blob): Promise<Float32Array | null> {
  try {
    const buf = await blob.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    let decoded: AudioBuffer;
    try {
      decoded = await new Promise<AudioBuffer>((resolve, reject) => {
        const p = ctx.decodeAudioData(buf.slice(0), resolve, reject);
        if (p && typeof p.then === "function") {
          p.then(resolve).catch(reject);
        }
      });
    } finally {
      ctx.close().catch(() => {});
    }

    const targetRate = 16000;
    const len = Math.ceil(decoded.duration * targetRate);
    if (len < 1600) return null; // too short (< 0.1 s)

    const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    if (!OfflineCtx) return null;
    const offline = new OfflineCtx(1, len, targetRate);
    const src = offline.createBufferSource();
    src.buffer = decoded;
    src.connect(offline.destination);
    src.start(0);
    const rendered = await offline.startRendering();
    return rendered.getChannelData(0);
  } catch (err) {
    console.warn("[VoiceTranslate] Audio decode error:", err);
    return null;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
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

  // Default to Hindi for India disaster reporting, or active app locale if Indic
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    const current = (i18n?.language || "").toLowerCase();
    if (current.startsWith("bn")) return "bn";
    if (current.startsWith("ne")) return "ne";
    if (current.startsWith("as")) return "as";
    if (current.startsWith("hi")) return "hi";
    // Primary field reporting language across Indian disaster zones
    return "hi";
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const [processingAudio, setProcessingAudio] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);
  const recordStartRef = useRef<number>(0);
  const isListeningRef = useRef(false);
  const valueRef = useRef(value);

  // Parallel live recognition ref & status
  const recognitionRef = useRef<any>(null);
  const hasLiveTranscribedRef = useRef(false);

  useEffect(() => { valueRef.current = value; }, [value]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      setMicSupported(false);
    }
  }, []);

  const showNotice = useCallback((msg: string, ms = 5000) => {
    setNotice(msg);
    if (ms > 0) setTimeout(() => setNotice(null), ms);
  }, []);

  // Find active language configuration (guaranteed non-null fallback to Hindi)
  const activeLangConfig: LanguageOption =
    ALL_LANGUAGES.find((l) => l.code === selectedLang) || QUICK_LANGUAGES[0]!;

  const handleLiveTranslateAndAppend = useCallback(
    async (spokenText: string) => {
      const trimmed = spokenText.trim();
      if (!trimmed) return;
      hasLiveTranscribedRef.current = true;
      setIsTranslating(true);

      try {
        // Translate spoken text (in selected language) to English
        const res = await translateToEnglish(trimmed, activeLangConfig.code);
        const translated = res.translatedText.trim();
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
        console.warn("[VoiceTranslate] Live translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    },
    [activeLangConfig, onChange, showNotice]
  );

  const attachSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = false;
      // Use exact speech recognition language code (e.g. hi-IN, bn-IN, en-IN)
      recognition.lang = activeLangConfig.speechCode;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        if (!isListeningRef.current) return;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || "";
          if (result.isFinal && transcript.trim()) {
            handleLiveTranslateAndAppend(transcript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.info("[VoiceTranslate] Live speech recognition event:", event.error);
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
  }, [activeLangConfig.speechCode, handleLiveTranslateAndAppend]);

  // ── Post-recording Whisper transcription + translation fallback ───────────
  const transcribeBlob = useCallback(async (blob: Blob, durationSecs: number) => {
    setProcessingAudio(true);
    showNotice(`🔄 Transcribing ${activeLangConfig.label} speech…`, 0);

    try {
      const float32 = await blobToFloat32(blob);
      if (!float32) throw new Error("audio-decode-failed");

      const pipe = await getWhisperPipeline((msg) => setNotice(msg));

      // Transcribe in native language first (far more accurate than tiny model translation)
      const result = await pipe(float32, {
        task: "transcribe",
        language: activeLangConfig.whisperLang,
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: false,
      });

      const rawText: string = (
        Array.isArray(result)
          ? result.map((r: any) => r.text).join(" ")
          : result?.text || ""
      ).trim();

      if (rawText && rawText.length > 1) {
        showNotice("🔄 Translating to English…", 0);
        // Translate the native transcription to English using Google Translate / offline dict
        const translationRes = await translateToEnglish(rawText, activeLangConfig.code);
        const finalText = translationRes.translatedText.trim() || rawText;

        const current = (valueRef.current || "").trim();
        const updated = current ? `${current} ${finalText}` : finalText;
        valueRef.current = updated;
        onChange(updated);
        showNotice(
          activeLangConfig.code !== "en"
            ? `✓ Transcribed & translated from ${activeLangConfig.label} (${durationSecs}s)`
            : `✓ Transcribed in English (${durationSecs}s)`
        );
      } else {
        throw new Error("empty-result");
      }
    } catch (err) {
      console.warn("[VoiceTranslate] Whisper fallback failed:", err);
      // Fallback: plain voice note tag
      const current = (valueRef.current || "").trim();
      const tag = `[🎙️ Voice note (${durationSecs}s)]`;
      const updated = current ? `${current} ${tag}` : tag;
      valueRef.current = updated;
      onChange(updated);
      showNotice(`⚠️ Saved voice note (${durationSecs}s)`);
    } finally {
      setProcessingAudio(false);
    }
  }, [activeLangConfig, onChange, showNotice]);

  const startListening = useCallback(async () => {
    if (isListeningRef.current) return;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: any) {
      const n = err?.name || "";
      if (n === "NotAllowedError" || n === "PermissionDeniedError") {
        showNotice("⚠️ Microphone access blocked — allow mic in browser settings.");
      } else if (n === "NotFoundError") {
        showNotice("⚠️ No microphone found on this device.");
      } else {
        showNotice("⚠️ Could not access microphone.");
      }
      return;
    }

    audioStreamRef.current = stream;
    audioChunksRef.current = [];
    hasLiveTranscribedRef.current = false;

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
      // Stop mic hardware
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;

      const durationSecs = Math.max(1, Math.round((Date.now() - recordStartRef.current) / 1000));
      const blob = new Blob(audioChunksRef.current, { type: mimeType || "audio/webm" });

      // Save audio to IndexedDB (for offline report attachment)
      try {
        const mediaId = `voice_memo_${Date.now()}`;
        await saveOfflineMedia(mediaId, blob, {
          name: `${mediaId}.webm`,
          mimeType: blob.type,
          size: blob.size,
        });
        if (onAudioRecorded) onAudioRecorded(blob, mediaId);
      } catch {
        // Non-fatal
      }

      // If live transcription already captured the text, skip Whisper
      if (hasLiveTranscribedRef.current) {
        showNotice(`✓ Live translated (${durationSecs}s)`);
      } else {
        await transcribeBlob(blob, durationSecs);
      }
    };

    mediaRecorderRef.current = recorder;
    recorder.start(250);
    recordStartRef.current = Date.now();
    setAudioRecordDuration(0);
    isListeningRef.current = true;
    setIsListening(true);

    // Try parallel live speech recognition in selected language
    attachSpeechRecognition();

    recordTimerRef.current = setInterval(() => {
      setAudioRecordDuration(Math.round((Date.now() - recordStartRef.current) / 1000));
    }, 1000);

    showNotice(`🎙️ Listening in ${activeLangConfig.label}… speak clearly.`, 4000);
  }, [activeLangConfig, attachSpeechRecognition, transcribeBlob, onAudioRecorded, showNotice]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current?.state !== "inactive") {
      try { mediaRecorderRef.current?.stop(); } catch {}
      mediaRecorderRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    clearInterval(recordTimerRef.current);
    recordTimerRef.current = null;
    setIsListening(false);
  }, []);

  const toggle = useCallback(async (e?: React.MouseEvent) => {
    e?.preventDefault(); e?.stopPropagation();
    if (disabled || processingAudio) return;
    isListeningRef.current ? stopListening() : await startListening();
  }, [disabled, processingAudio, startListening, stopListening]);

  useEffect(() => () => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current?.state !== "inactive") {
      try { mediaRecorderRef.current?.stop(); } catch {}
    }
    audioStreamRef.current?.getTracks().forEach((t) => t.stop());
    clearInterval(recordTimerRef.current);
  }, []);

  // ── Translate typed text ───────────────────────────────────────────────────
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

  const isBusy = processingAudio || isTranslating;

  return (
    <div className="grid gap-1.5 text-left">
      {/* Label and Language Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <Label
          htmlFor={id}
          className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5"
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          <span>{label || t("field_observation.notes_label", "Field Notes & Description")}</span>
        </Label>

        {/* Quick Language Selection Chips */}
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

          {/* More languages dropdown */}
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
          {micSupported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              disabled={disabled || isBusy}
              onClick={toggle}
              className={`h-7 w-7 p-0 rounded-full shadow-sm transition-all ${
                isListening ? "animate-pulse ring-2 ring-red-400" : "bg-card hover:bg-secondary"
              }`}
              title={
                isListening
                  ? "Stop recording"
                  : `Speak in ${activeLangConfig.label} (auto-translates to English)`
              }
              aria-label="Toggle voice recording"
            >
              {isBusy && !isListening ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <Mic className={`h-3.5 w-3.5 ${isListening ? "text-white" : "text-primary"}`} />
              )}
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isTranslating || !value.trim()}
            onClick={handleTranslateTyped}
            className="h-7 w-7 p-0 rounded-full bg-card hover:bg-secondary shadow-sm"
            title="Translate typed text to English"
            aria-label="Translate"
          >
            {isTranslating
              ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              : <Languages className="h-3.5 w-3.5 text-primary" />
            }
          </Button>

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

      <div className="flex flex-wrap items-center justify-between gap-1 text-[0.65rem] font-mono">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isListening && (
            <Badge
              variant="destructive"
              className="animate-pulse flex items-center gap-1 px-1.5 py-0.5 text-[0.62rem] bg-red-600 text-white"
            >
              <Mic className="h-3 w-3" />
              <span>
                REC {Math.floor(audioRecordDuration / 60)}:{(audioRecordDuration % 60).toString().padStart(2, "0")} • {activeLangConfig.label}
              </span>
            </Badge>
          )}

          {processingAudio && !isListening && (
            <span className="text-primary flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Processing speech…</span>
            </span>
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
          {value.length}/{maxLength} • {t("field_observation.auto_en", "Auto English")}
        </div>
      </div>
    </div>
  );
}
