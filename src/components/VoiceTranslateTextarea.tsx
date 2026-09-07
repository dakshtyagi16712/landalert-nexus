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
  { code: "hi-IN", name: "🇮🇳 Hindi (हिन्दी)", speechCode: "hi-IN" },
  { code: "bn-IN", name: "🇮🇳 Bengali (বাংলা)", speechCode: "bn-IN" },
  { code: "as-IN", name: "🇮🇳 Assamese (অসমীয়া)", speechCode: "as-IN" },
  { code: "ne-NP", name: "🇮🇳 Nepali (नेपाली)", speechCode: "ne-NP" },
  { code: "en-IN", name: "🇮🇳 English (India)", speechCode: "en-IN" },
  { code: "en-US", name: "🇬🇧 English (Global)", speechCode: "en-US" },
];

/** Convert audio Blob → Float32Array at 16 kHz (required by Whisper) */
async function audioToFloat32At16k(blob: Blob): Promise<Float32Array | null> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    // Decode at native sample rate
    const tempCtx = new AudioContext();
    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);
    } finally {
      await tempCtx.close();
    }
    // Resample to 16 kHz via OfflineAudioContext
    const targetRate = 16000;
    const targetLength = Math.ceil(audioBuffer.duration * targetRate);
    const offlineCtx = new OfflineAudioContext(1, targetLength, targetRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);
    const rendered = await offlineCtx.startRendering();
    return rendered.getChannelData(0);
  } catch {
    return null;
  }
}

// Singleton Whisper worker — created once, shared across all instances
let _whisperWorker: Worker | null = null;
function getWhisperWorker(): Worker {
  if (!_whisperWorker) {
    _whisperWorker = new Worker(
      new URL("../lib/whisper-worker.ts", import.meta.url),
      { type: "module" }
    );
  }
  return _whisperWorker;
}

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
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  // Whisper state: 'idle' | 'loading' | 'transcribing'
  const [whisperState, setWhisperState] = useState<"idle" | "loading" | "transcribing">("idle");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);
  const recordStartTimeRef = useRef<number>(0);
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

  /**
   * Run Whisper on the recorded audio blob (post-recording).
   * Returns the transcribed+translated English text, or null on failure.
   */
  const transcribeWithWhisper = useCallback(
    (blob: Blob): Promise<string | null> => {
      return new Promise(async (resolve) => {
        // Convert audio to 16kHz Float32
        const float32 = await audioToFloat32At16k(blob);
        if (!float32 || float32.length < 1600) {
          // Too short / failed to decode
          resolve(null);
          return;
        }

        setWhisperState("loading");

        let worker: Worker;
        try {
          worker = getWhisperWorker();
        } catch {
          resolve(null);
          return;
        }

        const handleMessage = (e: MessageEvent) => {
          const { type, text, error, loaded, total } = e.data;
          if (type === "loading") {
            setWhisperState("loading");
            setTranslationNotice("⏳ Transcription model loading (first time only, ~40MB)…");
          } else if (type === "progress" && loaded && total) {
            const pct = Math.round((loaded / total) * 100);
            setTranslationNotice(`⏳ Loading model… ${pct}%`);
          } else if (type === "ready") {
            setWhisperState("transcribing");
            setTranslationNotice("🔄 Transcribing audio…");
          } else if (type === "result") {
            worker.removeEventListener("message", handleMessage);
            setWhisperState("idle");
            resolve(text || null);
          } else if (type === "error") {
            console.warn("[Whisper] Error:", error);
            worker.removeEventListener("message", handleMessage);
            setWhisperState("idle");
            resolve(null);
          }
        };

        worker.addEventListener("message", handleMessage);
        // After model loads it posts 'ready', then we can use it
        // But we send the request now — worker queues it after load
        setWhisperState("transcribing");
        setTranslationNotice("🔄 Transcribing…");
        // Transfer Float32Array ownership to avoid copy (perf)
        const transferable = float32.buffer.slice(0);
        worker.postMessage(
          { type: "transcribe", audioData: new Float32Array(transferable) },
          [transferable as ArrayBuffer]
        );
      });
    },
    [],
  );

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
        setTranslationNotice("⚠️ Could not access microphone.");
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
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }

      const durationSecs = Math.max(1, Math.round((Date.now() - recordStartTimeRef.current) / 1000));

      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }

      // Save audio to IndexedDB for offline report attachment
      let mediaId = "";
      try {
        mediaId = `voice_memo_${Date.now()}`;
        await saveOfflineMedia(mediaId, recordedBlob, {
          name: `${mediaId}.webm`,
          mimeType: recordedBlob.type || "audio/webm",
          size: recordedBlob.size,
        });
        if (onAudioRecorded) onAudioRecorded(recordedBlob, mediaId);
      } catch {
        // Non-fatal
      }

      // Transcribe with Whisper (works online AND offline after first model load)
      const transcribed = await transcribeWithWhisper(recordedBlob);
      setWhisperState("idle");
      setTranslationNotice(null);

      if (transcribed && transcribed.trim().length > 1) {
        // Whisper task:'translate' already outputs English — append directly
        const current = (valueRef.current || "").trim();
        const updated = current ? `${current} ${transcribed.trim()}` : transcribed.trim();
        valueRef.current = updated;
        onChange(updated);
        setTranslationNotice(`✓ Transcribed (${durationSecs}s) — voice note attached`);
      } else {
        // Transcription failed (first-load model issue, very short clip, etc.)
        // Append a plain audio note tag (no "offline" label — audio is always saved)
        const current = (valueRef.current || "").trim();
        const voiceTag = `[🎙️ Voice note (${durationSecs}s)]`;
        const updated = current ? `${current} ${voiceTag}` : voiceTag;
        valueRef.current = updated;
        onChange(updated);
        setTranslationNotice(`✓ Voice note (${durationSecs}s) saved — transcription pending`);
      }

      setTimeout(() => setTranslationNotice(null), 5000);
      setIsListening(false);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(250);
    recordStartTimeRef.current = Date.now();
    setAudioRecordDuration(0);
    isListeningRef.current = true;
    setIsListening(true);

    recordTimerRef.current = setInterval(() => {
      setAudioRecordDuration(Math.round((Date.now() - recordStartTimeRef.current) / 1000));
    }, 1000);

    setTranslationNotice("🎙️ Recording… Speak clearly. Transcription will run after you stop.");
    setTimeout(() => setTranslationNotice(null), 4000);
  }, [transcribeWithWhisper, onChange, onAudioRecorded]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
      mediaRecorderRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    setIsListening(false);
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

  const isBusy = whisperState !== "idle" || isTranslating;

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
          value={selectedVoiceLang}
          onChange={(e) => setSelectedVoiceLang(e.target.value)}
          disabled={isListening || disabled}
          aria-label="Voice input language"
          className="bg-secondary/50 border border-border rounded px-1.5 py-0.5 text-[0.68rem] font-sans text-foreground cursor-pointer focus:outline-none"
        >
          {SUPPORTED_VOICE_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
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
              "Speak or type in any language (Hindi, Bengali, Nepali, etc.) — transcribed to English after recording…",
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
              onClick={toggleListening}
              className={`h-7 w-7 p-0 rounded-full shadow-sm transition-all ${
                isListening ? "animate-pulse ring-2 ring-red-400" : "bg-card hover:bg-secondary"
              }`}
              title={
                isListening
                  ? "Stop recording"
                  : "Record voice note (Whisper AI — works offline)"
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
            onClick={handleTranslateExistingText}
            className="h-7 w-7 p-0 rounded-full bg-card hover:bg-secondary shadow-sm"
            title="Translate typed text to English"
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
              className="animate-pulse flex items-center gap-1 px-1.5 py-0.5 text-[0.62rem] bg-red-600 text-white font-mono"
            >
              <Mic className="h-3 w-3" />
              <span>
                REC {Math.floor(audioRecordDuration / 60)}:{(audioRecordDuration % 60).toString().padStart(2, "0")}
              </span>
            </Badge>
          )}

          {(whisperState === "loading" || whisperState === "transcribing") && !isListening && (
            <span className="text-primary flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{whisperState === "loading" ? "Loading AI model…" : "Transcribing…"}</span>
            </span>
          )}

          {isTranslating && (
            <span className="text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>{t("field_observation.translating_to_en", "Translating to English…")}</span>
            </span>
          )}

          {translationNotice && (
            <span className="text-emerald-500 font-semibold truncate max-w-xs">{translationNotice}</span>
          )}
        </div>

        <div className="text-muted-foreground shrink-0 text-right">
          {value.length}/{maxLength} • {t("field_observation.auto_en", "Auto English")}
        </div>
      </div>
    </div>
  );
}
