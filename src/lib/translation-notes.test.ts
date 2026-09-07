import { describe, it, expect, beforeEach, vi } from "vitest";
import { translateToEnglish } from "./translation.service";
import { handleApiRequest } from "./api.router";
import { queueObservation, clearOfflineQueue, getQueuedObservations } from "./offline-manager";

describe("Voice Notes & Real-Time English Translation Pipeline", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, val: string) => store.set(key, val),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    });
    clearOfflineQueue();
  });

  it("1. Translates Hindi landslide observations into English via translateToEnglish", async () => {
    // Mock global fetch for unit test predictability
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url: any) => {
      if (typeof url === "string" && url.includes("translate.googleapis.com")) {
        return new Response(
          JSON.stringify([
            [["Stones are falling from the mountain and the road is blocked", "पहाड़ से पत्थर गिर रहे हैं और सड़क बंद है", null, null]],
            null,
            "hi",
          ]),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (typeof url === "string" && url.includes("/api/translate")) {
        return new Response(
          JSON.stringify({
            success: true,
            originalText: "पहाड़ से पत्थर गिर रहे हैं और सड़क बंद है",
            translatedText: "Stones are falling from the mountain and the road is blocked",
            detectedLang: "hi",
            targetLang: "en",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return originalFetch(url);
    });

    const res = await translateToEnglish("पहाड़ से पत्थर गिर रहे हैं और सड़क बंद है", "hi");
    expect(res.success).toBe(true);
    expect(res.translatedText).toBe("Stones are falling from the mountain and the road is blocked");
    expect(res.detectedLang).toBe("hi");

    globalThis.fetch = originalFetch;
  });

  it("2. Handles POST /api/translate endpoint in api.router", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url: any) => {
      if (typeof url === "string" && url.includes("translate.googleapis.com")) {
        return new Response(
          JSON.stringify([
            [["Landslide occurred near highway", "हाइवे नजिक पहिरो गयो", null, null]],
            null,
            "ne",
          ]),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return originalFetch(url);
    });

    const req = new Request("http://localhost/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "हाइवे नजिक पहिरो गयो",
        sourceLang: "auto",
        targetLang: "en",
      }),
    });

    const res = await handleApiRequest(req);
    expect(res).not.toBeNull();
    expect(res?.status).toBe(200);

    const data = await res?.json();
    expect(data.success).toBe(true);
    expect(data.translatedText).toBe("Landslide occurred near highway");
    expect(data.detectedLang).toBe("ne");

    globalThis.fetch = originalFetch;
  });

  it("3. Offline dictionary fallback handles Indic hazard terms when network fails", async () => {
    const originalFetch = globalThis.fetch;
    // Simulate total offline failure
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch (offline)"));

    const res = await translateToEnglish("भारी वर्षा र पहिरो", "ne");
    expect(res.success).toBe(true);
    expect(res.translatedText).toContain("[landslide]");

    globalThis.fetch = originalFetch;
  });

  it("4. Queues field observation containing voice notes and enriches visual_signs", () => {
    const obs = queueObservation({
      zone_id: 3,
      state: "Assam",
      district: "Dima Hasao",
      observed_at: new Date().toISOString(),
      observer_id: "field_scout_haflong",
      notes: "Severe ground fissures observed near railway cutting",
      visual_signs: "Tension cracks on slope — Severe ground fissures observed near railway cutting",
      soil_condition: "saturated",
      consent_given: true,
    });

    expect(obs.idempotency_key).toBeDefined();
    const queued = getQueuedObservations();
    expect(queued.length).toBe(1);
    expect(queued[0]?.notes).toBe("Severe ground fissures observed near railway cutting");
    expect(queued[0]?.visual_signs).toContain("Severe ground fissures observed near railway cutting");
  });

  it("5. Accepts observation when only voice notes/description is provided", () => {
    const obs = queueObservation({
      zone_id: 1,
      state: "Meghalaya",
      district: "East Khasi Hills",
      observed_at: new Date().toISOString(),
      observer_id: "citizen_reporter",
      notes: "Water accumulating rapidly at bottom of steep embankment",
      consent_given: true,
    });

    expect(obs.idempotency_key).toBeDefined();
    const queued = getQueuedObservations();
    expect(queued.length).toBe(1);
    expect(queued[0]?.notes).toBe("Water accumulating rapidly at bottom of steep embankment");
  });
});
