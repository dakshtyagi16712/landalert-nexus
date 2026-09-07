/**
 * src/lib/whisper-worker.ts
 * ========================
 * Web Worker: runs OpenAI Whisper (tiny multilingual) entirely in the browser
 * via @xenova/transformers + WebAssembly. Downloads ~40MB model on first use,
 * then cached in browser storage for fully offline use.
 *
 * Messages IN  (from main thread):
 *   { type: 'transcribe', audioData: Float32Array }
 *
 * Messages OUT (to main thread):
 *   { type: 'loading' }           — model download started
 *   { type: 'progress', loaded, total }
 *   { type: 'ready' }             — model ready
 *   { type: 'result', text }      — transcription done
 *   { type: 'error', error }      — something failed
 */

import { pipeline, env } from "@xenova/transformers";

// Use WASM backend (browser-safe, no Node native modules)
env.backends.onnx.wasm.proxy = false;

// Cache models in browser's cache storage (persists across sessions)
env.useBrowserCache = true;
env.allowLocalModels = false;

let pipe: any = null;

self.addEventListener("message", async (event: MessageEvent) => {
  const { type, audioData } = event.data;
  if (type !== "transcribe") return;

  // Load model on first call
  if (!pipe) {
    self.postMessage({ type: "loading" });
    try {
      pipe = await pipeline(
        "automatic-speech-recognition",
        // whisper-tiny multilingual: supports Hindi, Bengali, Nepali, Assamese, etc.
        "Xenova/whisper-tiny",
        {
          progress_callback: (progress: any) => {
            if (progress?.loaded && progress?.total) {
              self.postMessage({
                type: "progress",
                loaded: progress.loaded,
                total: progress.total,
              });
            }
          },
        }
      );
      self.postMessage({ type: "ready" });
    } catch (err: any) {
      self.postMessage({ type: "error", error: String(err?.message || err) });
      pipe = null;
      return;
    }
  }

  try {
    // task: 'translate' → always outputs English regardless of input language
    const result = await pipe(audioData, {
      task: "translate",
      language: "auto",
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: false,
    });
    const text: string = Array.isArray(result)
      ? result.map((r: any) => r.text).join(" ").trim()
      : (result?.text || "").trim();
    self.postMessage({ type: "result", text });
  } catch (err: any) {
    self.postMessage({ type: "error", error: String(err?.message || err) });
  }
});
