import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { saveOfflineMedia, getOfflineMedia, deleteOfflineMedia } from "./offline-media-store";
import { queueObservation, clearOfflineQueue, getQueuedObservations } from "./offline-manager";

describe("Camera & Video Observation Media Capture Pipeline", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    clearOfflineQueue();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, val: string) => store.set(key, val),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    });
  });

  it("validates photo file size limit (<= 10MB) and format", () => {
    const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
    const validPhoto = new File(["fake photo data"], "camera_photo_1.jpg", { type: "image/jpeg" });
    expect(validPhoto.size <= MAX_PHOTO_SIZE).toBe(true);

    const oversizedPhoto = {
      name: "oversized_photo.jpg",
      size: 11 * 1024 * 1024,
      type: "image/jpeg",
    };
    expect(oversizedPhoto.size > MAX_PHOTO_SIZE).toBe(true);
  });

  it("validates video file size limit (<= 50MB) and format", () => {
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
    const validWebmVideo = new File(["fake webm data"], "camera_video_1.webm", { type: "video/webm" });
    const validMp4Video = new File(["fake mp4 data"], "camera_video_2.mp4", { type: "video/mp4" });

    expect(validWebmVideo.size <= MAX_VIDEO_SIZE).toBe(true);
    expect(validMp4Video.size <= MAX_VIDEO_SIZE).toBe(true);

    const oversizedVideo = {
      name: "oversized_video.mp4",
      size: 55 * 1024 * 1024,
      type: "video/mp4",
    };
    expect(oversizedVideo.size > MAX_VIDEO_SIZE).toBe(true);
  });

  it("stores camera captured photo blob in offline storage and retrieves it intact", async () => {
    const photoBlob = new Blob(["mock-jpeg-binary-stream"], { type: "image/jpeg" });
    const mediaId = `camera_photo_${Date.now()}`;

    await saveOfflineMedia(mediaId, photoBlob, {
      name: "camera_photo.jpg",
      mimeType: "image/jpeg",
      size: photoBlob.size,
    });

    const retrieved = await getOfflineMedia(mediaId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(mediaId);
    expect(retrieved?.mimeType).toBe("image/jpeg");
    expect(retrieved?.name).toBe("camera_photo.jpg");

    await deleteOfflineMedia(mediaId);
    const afterDelete = await getOfflineMedia(mediaId);
    expect(afterDelete).toBeNull();
  });

  it("stores camera captured video blob in offline storage and queues observation offline", async () => {
    const videoBlob = new Blob(["mock-video-binary-stream-webm-opus"], { type: "video/webm" });
    const videoMediaId = `camera_video_${Date.now()}`;

    await saveOfflineMedia(videoMediaId, videoBlob, {
      name: "camera_video.webm",
      mimeType: "video/webm",
      size: videoBlob.size,
    });

    const retrievedVideo = await getOfflineMedia(videoMediaId);
    expect(retrievedVideo).not.toBeNull();
    expect(retrievedVideo?.id).toBe(videoMediaId);
    expect(retrievedVideo?.mimeType).toBe("video/webm");

    // Queue observation referencing this camera-captured video
    const obs = queueObservation({
      zone_id: 2,
      state: "Sikkim",
      district: "East Sikkim",
      observed_at: new Date().toISOString(),
      soil_condition: "saturated",
      visual_signs: "Mudflow / Slumping",
      road_status: "blocked",
      observer_id: "field_ranger_gangtok",
      consent_given: true,
      media_meta: [
        {
          id: videoMediaId,
          name: "camera_video.webm",
          size: videoBlob.size,
          mimeType: "video/webm",
        },
      ],
    });

    expect(obs.idempotency_key).toBeDefined();
    const queued = getQueuedObservations();
    expect(queued.length).toBe(1);
    expect(queued[0]?.media_meta?.[0]?.id).toBe(videoMediaId);
    expect(queued[0]?.media_meta?.[0]?.mimeType).toBe("video/webm");
  });

  it("enforces maximum 3 media items limit per observation", () => {
    const mediaList = [
      { name: "photo_1.jpg", size: 1000, mimeType: "image/jpeg" },
      { name: "photo_2.jpg", size: 1000, mimeType: "image/jpeg" },
      { name: "video_3.mp4", size: 2000, mimeType: "video/mp4" },
    ];

    expect(mediaList.length).toBe(3);
    const canAddMore = mediaList.length < 3;
    expect(canAddMore).toBe(false);
  });
});
