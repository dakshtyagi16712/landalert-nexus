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

const SUPPORTED_VOICE_LANGUAGES = [
  { code: "auto", name: "🌐 Auto / Current App Language", speechCode: "" },
  { code: "hi", name: "🇮🇳 Hindi (हिन्दी)", speechCode: "hi-IN" },
  { code: "bn", name: "🇮🇳 Bengali (বাংলা)", speechCode: "bn-IN" },
  { code: "as", name: "🇮🇳 Assamese (অসমীয়া)", speechCode: "as-IN" },
  { code: "ne", name: "🇮🇳 Nepali (नेपाली)", speechCode: "ne-NP" },
  { code: "en", name: "🇮🇳 English", speechCode: "en-IN" },
];

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
  const [selectedLang, setSelectedLang] = useState("auto");
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

  const getEffectiveSpeechLang = useCallback(() => {
    if (selectedLang !== "auto") {
      const match = SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === selectedLang);
      if (match?.speechCode) return match.speechCode;
    }
    const current = (i18n.language || "").toLowerCase();
    if (current.startsWith("hi")) return "hi-IN";
    if (current.startsWith("bn")) return "bn-IN";
    if (current.startsWith("as")) return "as-IN";
    if (current.startsWith("ne")) return "ne-NP";
    if (current.startsWith("en")) return "en-IN";
    if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
    return "en-IN";
  }, [selectedLang, i18n.language]);

  const getWhisperLang = useCallback(() => {
    if (selectedLang !== "auto") return selectedLang;
    const lang = (i18n.language || navigator?.language || "en").toLowerCase();
    if (lang.startsWith("hi")) return "hi";
    if (lang.startsWith("bn")) return "bn";
    if (lang.startsWith("as")) return "as";
    if (lang.startsWith("ne")) return "ne";
    return undefined; // Auto-detect
  }, [selectedLang, i18n.language]);

  const handleLiveTranslateAndAppend = useCallback(
    async (spokenText: string) => {
      if (!spokenText.trim()) return;
      hasLiveTranscribedRef.current = true;
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
        showNotice(
          res.detectedLang && res.detectedLang !== "en"
            ? `✓ Translated from ${res.detectedLang.toUpperCase()} → English`
            : "✓ Transcribed in English"
        );
      }
    },
    [getEffectiveSpeechLang, onChange, showNotice]
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
      recognition.lang = getEffectiveSpeechLang();
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
  }, [getEffectiveSpeechLang, handleLiveTranslateAndAppend]);

  // ── Post-recording Whisper transcription fallback ─────────────────────────
  const transcribeBlob = useCallback(async (blob: Blob, durationSecs: number) => {
    setProcessingAudio(true);
    showNotice("🔄 Converting speech to English text…", 0);

    try {
      const float32 = await blobToFloat32(blob);
      if (!float32) throw new Error("audio-decode-failed");

      const pipe = await getWhisperPipeline((msg) => setNotice(msg));

      const whisperLang = getWhisperLang();
      const result = await pipe(float32, {
        task: "translate", // Always output English
        language: whisperLang,
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: false,
      });

      const text: string = (
        Array.isArray(result)
          ? result.map((r: any) => r.text).join(" ")
          : result?.text || ""
      ).trim();

      if (text && text.length > 1) {
        const current = (valueRef.current || "").trim();
        const updated = current ? `${current} ${text}` : text;
        valueRef.current = updated;
        onChange(updated);
        showNotice(`✓ Transcribed to English (${durationSecs}s)`);
      } else {
        throw new Error("empty-result");
      }
    } catch (err) {
      console.warn("[VoiceTranslate] Transcription failed:", err);
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
  }, [getWhisperLang, onChange, showNotice]);

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

      // If live transcription already captured the text, skip post-processing
      if (hasLiveTranscribedRef.current) {
        showNotice(`✓ Live transcribed (${durationSecs}s)`);
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

    // Try parallel live speech recognition
    attachSpeechRecognition();

    recordTimerRef.current = setInterval(() => {
      setAudioRecordDuration(Math.round((Date.now() - recordStartRef.current) / 1000));
    }, 1000);

    showNotice("🎙️ Listening… speak in your language.", 4000);
  }, [attachSpeechRecognition, transcribeBlob, onAudioRecorded, showNotice]);

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
    const res = await translateToEnglish(value.trim(), "auto");
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
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5"
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          <span>{label || t("field_observation.notes_label", "Field Notes & Description")}</span>
        </Label>

        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          disabled={isListening || disabled}
          aria-label="Voice language"
          className="bg-secondary/50 border border-border rounded px-1.5 py-0.5 text-[0.68rem] font-sans text-foreground cursor-pointer focus:outline-none"
        >
          {SUPPORTED_VOICE_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
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
              "Speak or type in any language — auto-transcribes and translates to English…",
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
              title={isListening ? "Stop recording" : "Record voice (translates to English)"}
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
                REC {Math.floor(audioRecordDuration / 60)}:{(audioRecordDuration % 60).toString().padStart(2, "0")}
              </span>
            </Badge>
          )}

          {processingAudio && !isListening && (
            <span className="text-primary flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Processing audio…</span>
            </span>
          )}

          {isTranslating && (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>{t("field_observation.translating_to_en", "Translating…")}</span>
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
