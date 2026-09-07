import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Video,
  FlipHorizontal,
  RotateCcw,
  Check,
  Circle,
  Square,
  AlertCircle,
  Smartphone,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ObservationCameraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "photo" | "video";
  onCapture: (file: File) => void;
  maxPhotoSizeBytes?: number; // default 10MB
  maxVideoSizeBytes?: number; // default 50MB
  maxDurationSeconds?: number; // default 60s
}

export function ObservationCameraModal({
  open,
  onOpenChange,
  initialMode = "photo",
  onCapture,
  maxPhotoSizeBytes = 10 * 1024 * 1024,
  maxVideoSizeBytes = 50 * 1024 * 1024,
  maxDurationSeconds = 60,
}: ObservationCameraModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"photo" | "video">(initialMode);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [streamActive, setStreamActive] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Photo state
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [capturedPhotoBlob, setCapturedPhotoBlob] = useState<Blob | null>(null);

  // Video state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [capturedVideoUrl, setCapturedVideoUrl] = useState<string | null>(null);
  const [capturedVideoBlob, setCapturedVideoBlob] = useState<Blob | null>(null);
  const [videoMimeType, setVideoMimeType] = useState<string>("video/webm");

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Fallback native input refs
  const fallbackPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const fallbackVideoInputRef = useRef<HTMLInputElement | null>(null);

  // Reset initial mode whenever modal is opened
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setCapturedPhotoUrl(null);
      setCapturedPhotoBlob(null);
      setCapturedVideoUrl(null);
      setCapturedVideoBlob(null);
      setIsRecording(false);
      setRecordingSeconds(0);
      setStreamError(null);
    } else {
      stopActiveStream();
    }
  }, [open, initialMode]);

  // Clean stop of all audio & video tracks
  const stopActiveStream = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    setStreamActive(false);
  }, []);

  // Detect supported video mime type
  const getSupportedVideoMime = useCallback((): string => {
    if (typeof MediaRecorder === "undefined") return "";
    const types = [
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9,opus",
      "video/webm",
      "video/mp4",
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return "";
  }, []);

  // Initialize camera stream
  const startCameraStream = useCallback(async () => {
    stopActiveStream();
    setStreamError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStreamError(
        t(
          "field_observation.camera_unsupported",
          "Direct browser camera stream is not supported in this environment. Please use device camera app."
        )
      );
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: mode === "photo" ? 1920 : 1280 },
          height: { ideal: mode === "photo" ? 1080 : 720 },
        },
        audio: mode === "video",
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // prevent feedback loop during preview
        await videoRef.current.play().catch(() => {});
      }
      setStreamActive(true);
    } catch (err: any) {
      console.warn("[Camera] getUserMedia failed:", err);
      const isPermissionDenied =
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError";
      const errMsg = isPermissionDenied
        ? t(
            "field_observation.camera_denied",
            "Camera permission denied. Allow camera access in browser settings or use device camera app."
          )
        : t(
            "field_observation.camera_error",
            `Camera error: ${err.message || "Failed to start camera"}`
          );
      setStreamError(errMsg);
    }
  }, [facingMode, mode, stopActiveStream, t]);

  // Start stream when modal is open and not in a preview state
  useEffect(() => {
    if (open && !capturedPhotoUrl && !capturedVideoUrl) {
      startCameraStream();
    }
    return () => {
      stopActiveStream();
    };
  }, [open, mode, facingMode, capturedPhotoUrl, capturedVideoUrl, startCameraStream, stopActiveStream]);

  // Toggle front/rear camera
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Switch between Photo & Video mode
  const handleModeChange = (newMode: "photo" | "video") => {
    if (isRecording) {
      stopRecording();
    }
    setCapturedPhotoUrl(null);
    setCapturedPhotoBlob(null);
    setCapturedVideoUrl(null);
    setCapturedVideoBlob(null);
    setMode(newMode);
  };

  // --- PHOTO CAPTURE ---
  const handleCapturePhoto = () => {
    if (!videoRef.current || !streamRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvasRef.current = canvas;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip canvas horizontally if using front user camera for natural mirror effect
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setStreamError(t("field_observation.photo_blob_failed", "Failed to capture frame"));
          return;
        }
        if (blob.size > maxPhotoSizeBytes) {
          setStreamError(
            t(
              "field_observation.error_photo_size",
              `Captured photo exceeds ${Math.round(maxPhotoSizeBytes / (1024 * 1024))}MB limit.`
            )
          );
          return;
        }
        const url = URL.createObjectURL(blob);
        setCapturedPhotoBlob(blob);
        setCapturedPhotoUrl(url);
        // Stop stream while user previews
        stopActiveStream();
      },
      "image/jpeg",
      0.9
    );
  };

  const handleRetakePhoto = () => {
    if (capturedPhotoUrl) {
      URL.revokeObjectURL(capturedPhotoUrl);
    }
    setCapturedPhotoUrl(null);
    setCapturedPhotoBlob(null);
    setStreamError(null);
    startCameraStream();
  };

  const handleConfirmPhoto = () => {
    if (!capturedPhotoBlob) return;
    const filename = `camera_photo_${Date.now()}.jpg`;
    const file = new File([capturedPhotoBlob], filename, { type: "image/jpeg" });
    onCapture(file);
    onOpenChange(false);
  };

  // --- VIDEO CAPTURE ---
  const startRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    const mime = getSupportedVideoMime();
    setVideoMimeType(mime || "video/webm");

    try {
      const recorder = mime
        ? new MediaRecorder(streamRef.current, { mimeType: mime })
        : new MediaRecorder(streamRef.current);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        const chosenMime = mime || "video/webm";
        const blob = new Blob(recordedChunksRef.current, { type: chosenMime });

        if (blob.size > maxVideoSizeBytes) {
          setStreamError(
            t(
              "field_observation.error_video_size",
              `Recorded video (${(blob.size / (1024 * 1024)).toFixed(1)}MB) exceeds ${Math.round(
                maxVideoSizeBytes / (1024 * 1024)
              )}MB limit.`
            )
          );
          setIsRecording(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        setCapturedVideoBlob(blob);
        setCapturedVideoUrl(url);
        setIsRecording(false);
        stopActiveStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start(500); // chunk every 500ms
      setIsRecording(true);
      setRecordingSeconds(0);

      // Timer with auto-stop at maxDurationSeconds
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev + 1 >= maxDurationSeconds) {
            stopRecording();
            return maxDurationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn("[MediaRecorder] error starting recording:", err);
      setStreamError(t("field_observation.video_record_failed", `Video recording failed: ${err.message}`));
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleRetakeVideo = () => {
    if (capturedVideoUrl) {
      URL.revokeObjectURL(capturedVideoUrl);
    }
    setCapturedVideoUrl(null);
    setCapturedVideoBlob(null);
    setRecordingSeconds(0);
    setStreamError(null);
    startCameraStream();
  };

  const handleConfirmVideo = () => {
    if (!capturedVideoBlob) return;
    const isMp4 = videoMimeType.includes("mp4");
    const ext = isMp4 ? "mp4" : "webm";
    const filename = `camera_video_${Date.now()}.${ext}`;
    const file = new File([capturedVideoBlob], filename, {
      type: videoMimeType || "video/webm",
    });
    onCapture(file);
    onOpenChange(false);
  };

  // --- NATIVE OS DEVICE FALLBACK ---
  const handleFallbackFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("video/") && file.size > maxVideoSizeBytes) {
      setStreamError(
        t(
          "field_observation.error_video_size",
          `Video exceeds ${Math.round(maxVideoSizeBytes / (1024 * 1024))}MB limit.`
        )
      );
      return;
    }
    if (file.type.startsWith("image/") && file.size > maxPhotoSizeBytes) {
      setStreamError(
        t(
          "field_observation.error_photo_size",
          `Photo exceeds ${Math.round(maxPhotoSizeBytes / (1024 * 1024))}MB limit.`
        )
      );
      return;
    }
    onCapture(file);
    onOpenChange(false);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          stopActiveStream();
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-xl p-4 sm:p-6 bg-card border-border shadow-2xl rounded-xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
          <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            {mode === "photo" ? (
              <Camera className="h-5 w-5 text-primary" />
            ) : (
              <Video className="h-5 w-5 text-red-500" />
            )}
            <span>
              {mode === "photo"
                ? t("field_observation.camera_take_photo", "Take Photo")
                : t("field_observation.camera_record_video", "Record Video")}
            </span>
          </DialogTitle>

          {/* Mode Switchers */}
          {!capturedPhotoUrl && !capturedVideoUrl && (
            <div className="flex items-center gap-1 bg-secondary/60 p-0.5 rounded-lg border border-border">
              <Button
                type="button"
                variant={mode === "photo" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs font-medium"
                disabled={isRecording}
                onClick={() => handleModeChange("photo")}
              >
                <Camera className="h-3.5 w-3.5 mr-1" />
                {t("field_observation.camera_photo_mode", "Photo")}
              </Button>
              <Button
                type="button"
                variant={mode === "video" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs font-medium"
                disabled={isRecording}
                onClick={() => handleModeChange("video")}
              >
                <Video className="h-3.5 w-3.5 mr-1" />
                {t("field_observation.camera_video_mode", "Video")}
              </Button>
            </div>
          )}
        </DialogHeader>

        {/* Live Viewfinder or Review Container */}
        <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-border/60 my-2">
          {/* PHOTO REVIEW */}
          {capturedPhotoUrl && (
            <img
              src={capturedPhotoUrl}
              alt="Captured Frame"
              className="w-full h-full object-contain"
            />
          )}

          {/* VIDEO REVIEW */}
          {capturedVideoUrl && (
            <video
              src={capturedVideoUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          )}

          {/* LIVE CAMERA FEED */}
          {!capturedPhotoUrl && !capturedVideoUrl && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === "user" ? "scale-x-[-1]" : ""
                }`}
              />

              {/* Viewfinder Overlays */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-black/60 backdrop-blur-sm text-[0.68rem] text-white border-white/20 font-mono tracking-wider uppercase"
                >
                  {mode === "photo" ? "PHOTO 4:3" : "VIDEO HD"}
                </Badge>

                {isRecording && (
                  <Badge
                    variant="destructive"
                    className="animate-pulse flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-bold"
                  >
                    <Circle className="h-2.5 w-2.5 fill-current" />
                    REC {formatSeconds(recordingSeconds)} / {formatSeconds(maxDurationSeconds)}
                  </Badge>
                )}
              </div>

              {/* Flip camera button */}
              <button
                type="button"
                onClick={handleFlipCamera}
                disabled={isRecording}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition border border-white/20 shadow-md"
                title={t("field_observation.camera_flip", "Switch front/rear camera")}
                aria-label={t("field_observation.camera_flip", "Switch front/rear camera")}
              >
                <FlipHorizontal className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Stream Error Overlay */}
          {streamError && !capturedPhotoUrl && !capturedVideoUrl && (
            <div className="absolute inset-0 bg-background/95 p-4 flex flex-col items-center justify-center text-center gap-3">
              <AlertCircle className="h-8 w-8 text-amber-500" />
              <p className="text-xs text-foreground/80 max-w-md font-mono">{streamError}</p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={startCameraStream}
                  className="text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  {t("field_observation.retry", "Retry Camera")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    if (mode === "photo") {
                      fallbackPhotoInputRef.current?.click();
                    } else {
                      fallbackVideoInputRef.current?.click();
                    }
                  }}
                >
                  <Smartphone className="h-3.5 w-3.5 mr-1" />
                  {t("field_observation.camera_open_device", "Open Device Camera App")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Fallback Inputs for Direct Mobile Device Camera */}
        <input
          ref={fallbackPhotoInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFallbackFileSelect}
        />
        <input
          ref={fallbackVideoInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={handleFallbackFileSelect}
        />

        {/* Canvas for rendering photo frames */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Action Controls Footer */}
        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/40">
          {/* REVIEW ACTIONS */}
          {capturedPhotoUrl && (
            <div className="flex w-full items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetakePhoto}
                className="text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                {t("field_observation.camera_retake", "Retake")}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleConfirmPhoto}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                {t("field_observation.camera_use_photo", "Use Photo")}
              </Button>
            </div>
          )}

          {capturedVideoUrl && (
            <div className="flex w-full items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetakeVideo}
                className="text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                {t("field_observation.camera_retake", "Retake")}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleConfirmVideo}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                {t("field_observation.camera_use_video", "Use Video")}
              </Button>
            </div>
          )}

          {/* LIVE CAPTURE ACTIONS */}
          {!capturedPhotoUrl && !capturedVideoUrl && (
            <div className="flex w-full items-center justify-between gap-2">
              {/* Left: Device Camera launcher */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  if (mode === "photo") {
                    fallbackPhotoInputRef.current?.click();
                  } else {
                    fallbackVideoInputRef.current?.click();
                  }
                }}
                title={t("field_observation.camera_open_device", "Launch device native camera app")}
              >
                <Smartphone className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">
                  {t("field_observation.camera_open_device", "Device Camera App")}
                </span>
                <span className="sm:hidden">Native</span>
              </Button>

              {/* Center: Main Trigger Button */}
              {mode === "photo" ? (
                <Button
                  type="button"
                  size="lg"
                  disabled={!streamActive}
                  onClick={handleCapturePhoto}
                  className="rounded-full h-12 w-12 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center"
                  aria-label={t("field_observation.camera_capture", "Capture Photo")}
                >
                  <Circle className="h-6 w-6 stroke-[3] fill-none" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  disabled={!streamActive && !isRecording}
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`rounded-full h-12 w-12 p-0 shadow-lg flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-400/40"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  aria-label={
                    isRecording
                      ? t("field_observation.camera_stop_record", "Stop Recording")
                      : t("field_observation.camera_start_record", "Start Recording")
                  }
                >
                  {isRecording ? (
                    <Square className="h-5 w-5 fill-current" />
                  ) : (
                    <Circle className="h-6 w-6 fill-current" />
                  )}
                </Button>
              )}

              {/* Right: Close / Cancel */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  stopActiveStream();
                  onOpenChange(false);
                }}
                className="text-xs"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                {t("field_observation.cancel", "Cancel")}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
