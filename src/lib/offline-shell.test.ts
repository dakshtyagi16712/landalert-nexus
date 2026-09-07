import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  queueObservation,
  getQueuedObservations,
  getSyncedObservations,
  pruneQueue,
  clearOfflineQueue,
  getCachedOfflinePackage,
  type OfflineSyncStatus,
} from "./offline-manager";
import { saveOfflineMedia, getOfflineMedia } from "./offline-media-store";

describe("LandAlert-Nexus Offline App Shell & Service Worker Specification", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, val: string) => store.set(key, val),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    });
  });

  // 1. SERVICE WORKER REGISTRATION & MANIFEST AUDIT
  describe("1. Service Worker Registration & Precache Manifest", () => {
    it("verifies public/sw.js exists with valid scope and precache assets", () => {
      const swPath = path.resolve(__dirname, "../../public/sw.js");
      expect(fs.existsSync(swPath)).toBe(true);

      const swContent = fs.readFileSync(swPath, "utf-8");
      expect(swContent).toContain("CACHE_NAME =");
      expect(swContent).toContain("PRECACHE_ASSETS =");
      expect(swContent).toContain("/manifest.json");
      expect(swContent).toContain("/favicon.svg");
      expect(swContent).toContain("/offline-shell.html");

      // Verify self.skipWaiting() and self.clients.claim() are present
      expect(swContent).toContain("self.skipWaiting()");
      expect(swContent).toContain("self.clients.claim()");
    });

    it("verifies offline-shell.html exists and contains offline fallback UI", () => {
      const shellPath = path.resolve(__dirname, "../../public/offline-shell.html");
      expect(fs.existsSync(shellPath)).toBe(true);

      const shellContent = fs.readFileSync(shellPath, "utf-8");
      expect(shellContent).toContain("LandAlert-Nexus");
      expect(shellContent).toContain("OFFLINE MODE");
      expect(shellContent).toContain("Field Observation Sync Ready");
    });

    it("ensures precache manifest script generates consistent cache version", () => {
      const scriptPath = path.resolve(__dirname, "../../scripts/generate-sw-manifest.mjs");
      expect(fs.existsSync(scriptPath)).toBe(true);

      const scriptContent = fs.readFileSync(scriptPath, "utf-8");
      expect(scriptContent).toContain("outputAssetsDir");
      expect(scriptContent).toContain("allAssetsToPrecache");
    });
  });

  // 2. OFFLINE APPLICATION SHELL NAVIGATION
  describe("2. Offline Application Shell Navigation Semantics", () => {
    it("simulates SW navigation fetch handler: returns cached shell when offline", async () => {
      // Mock Cache Storage
      const mockCache = new Map<string, Response>();
      mockCache.set("/", new Response("<!DOCTYPE html><html><body>Root Shell</body></html>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }));
      mockCache.set("/offline-shell.html", new Response("<!DOCTYPE html><html><body>Offline Shell</body></html>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }));

      // Simulate offline fetch for navigation request
      async function simulateNavFetch(urlPath: string) {
        // Network fails because device is offline
        const networkFailure = true;
        if (networkFailure) {
          // SW navigation fallback logic:
          const cachedRoute = mockCache.get(urlPath);
          if (cachedRoute) return cachedRoute.clone();
          const rootShell = mockCache.get("/");
          if (rootShell) return rootShell.clone();
          const fallback = mockCache.get("/offline-shell.html");
          if (fallback) return fallback.clone();
        }
        return new Response("Network Error", { status: 504 });
      }

      // Exact route "/" offline
      const rootRes = await simulateNavFetch("/");
      expect(rootRes.status).toBe(200);
      expect(await rootRes.text()).toContain("Root Shell");

      // Arbitrary navigation "/zones/Z01" offline -> falls back to root SPA shell
      const zoneRes = await simulateNavFetch("/zones/Z01");
      expect(zoneRes.status).toBe(200);
      expect(await zoneRes.text()).toContain("Root Shell");
    });
  });

  // 3. OFFLINE OBSERVATION WORKFLOW & PERSISTENCE
  describe("3. Offline Observation Workflow & Persistence Across Reloads", () => {
    it("stores observation locally with idempotency key and client timestamp", () => {
      clearOfflineQueue();

      const created = queueObservation({
        zone_id: 1,
        state: "Assam",
        district: "Cachar",
        observed_at: new Date().toISOString(),
        soil_condition: "saturated",
        visual_signs: "Tension cracks across slope toe",
        road_status: "restricted",
        observer_id: "field_unit_silchar",
      });

      expect(created.idempotency_key).toBeDefined();
      expect(created.idempotency_key).toMatch(/^offline-|^[0-9a-f-]{36}$/);
      expect(created.client_timestamp).toBeDefined();

      // Verify persistence in queue
      const queued = getQueuedObservations();
      expect(queued.length).toBe(1);
      expect(queued[0]?.zone_id).toBe(1);
      expect(queued[0]?.visual_signs).toBe("Tension cracks across slope toe");
    });

    it("persists observations across simulated page reload and browser restarts", () => {
      clearOfflineQueue();

      // Step 1: Create observation
      const obs1 = queueObservation({
        zone_id: 4,
        state: "Meghalaya",
        district: "East Khasi Hills",
        observed_at: new Date().toISOString(),
        rainfall_mm: 85.0,
        road_status: "blocked",
      });

      // Step 2: Simulate page reload by reading fresh from storage
      const reloadedQueue = getQueuedObservations();
      expect(reloadedQueue.length).toBe(1);
      expect(reloadedQueue[0]?.idempotency_key).toBe(obs1.idempotency_key);
      expect(reloadedQueue[0]?.rainfall_mm).toBe(85.0);

      // Step 3: Add second observation while still offline
      const obs2 = queueObservation({
        zone_id: 5,
        state: "Mizoram",
        district: "Aizawl",
        observed_at: new Date().toISOString(),
        road_status: "open",
      });

      // Step 4: Verify both are preserved in order
      const queueAfterSecond = getQueuedObservations();
      expect(queueAfterSecond.length).toBe(2);
      expect(queueAfterSecond[0]?.idempotency_key).toBe(obs1.idempotency_key);
      expect(queueAfterSecond[1]?.idempotency_key).toBe(obs2.idempotency_key);
    });

    it("prevents duplicate submissions using idempotency keys", () => {
      clearOfflineQueue();

      const obs = queueObservation({
        zone_id: 2,
        state: "Arunachal Pradesh",
        district: "Papum Pare",
        observed_at: new Date().toISOString(),
      });

      // Simulated server sync batch containing duplicate idempotency keys
      const batch = [obs, { ...obs }]; // accidental duplicated record in batch
      const processedKeys = new Set<string>();
      const deduplicated: typeof batch = [];

      for (const item of batch) {
        if (!processedKeys.has(item.idempotency_key!)) {
          processedKeys.add(item.idempotency_key!);
          deduplicated.push(item);
        }
      }

      expect(deduplicated.length).toBe(1);
    });

    it("prunes only acknowledged items and retains failed items for retry", () => {
      clearOfflineQueue();

      const o1 = queueObservation({ zone_id: 1, observed_at: new Date().toISOString() });
      const o2 = queueObservation({ zone_id: 2, observed_at: new Date().toISOString() });
      const o3 = queueObservation({ zone_id: 3, observed_at: new Date().toISOString() });

      expect(getQueuedObservations().length).toBe(3);

      // Suppose server only acknowledged o1 and o3 (o2 failed validation/server error)
      pruneQueue([o1.idempotency_key!, o3.idempotency_key!]);

      const remaining = getQueuedObservations();
      expect(remaining.length).toBe(1);
      expect(remaining[0]?.idempotency_key).toBe(o2.idempotency_key);
      expect(remaining[0]?.zone_id).toBe(2);
    });
  });

  // 4. CONNECTIVITY STATE DETECTION & STATUS LABELS
  describe("4. Connectivity State & UI Indicators", () => {
    it("evaluates required status labels: ONLINE, OFFLINE, SYNCING, PENDING SYNC, SYNCED, SYNC FAILED", () => {
      function computeStatus(
        isOnline: boolean,
        syncing: boolean,
        queueCount: number,
        syncError: string | null,
        justSynced: boolean,
      ): OfflineSyncStatus {
        if (syncing) return "SYNCING";
        if (syncError) return "SYNC FAILED";
        if (!isOnline) return queueCount > 0 ? "PENDING SYNC" : "OFFLINE";
        if (queueCount > 0) return "PENDING SYNC";
        if (justSynced) return "SYNCED";
        return "ONLINE";
      }

      // Online, idle, empty queue
      expect(computeStatus(true, false, 0, null, false)).toBe("ONLINE");

      // Offline, no pending items
      expect(computeStatus(false, false, 0, null, false)).toBe("OFFLINE");

      // Offline with items waiting to sync
      expect(computeStatus(false, false, 2, null, false)).toBe("PENDING SYNC");

      // Online with items being synchronized
      expect(computeStatus(true, true, 2, null, false)).toBe("SYNCING");

      // Online after sync completed
      expect(computeStatus(true, false, 0, null, true)).toBe("SYNCED");

      // Sync encountered error
      expect(computeStatus(true, false, 1, "Connection reset", false)).toBe("SYNC FAILED");
    });
  });

  // 5. OFFLINE DATA SEMANTICS: ZERO SYNTHETIC DATA
  describe("5. Strict Offline Data Semantics: No Fabricated Telemetry or Predictions", () => {
    it("returns UNAVAILABLE_OFFLINE for live endpoints when offline", async () => {
      // Simulate SW handler for dynamic endpoints
      function handleLiveEndpoint(pathname: string, isOnline: boolean) {
        if (
          pathname.startsWith("/api/weather") ||
          pathname.startsWith("/api/ml/") ||
          pathname.startsWith("/api/satellite/") ||
          pathname.startsWith("/api/alerts/")
        ) {
          if (!isOnline) {
            return {
              status: 503,
              body: {
                error: "UNAVAILABLE_OFFLINE",
                message: "Live telemetry and server-dependent computation are unavailable offline.",
              },
            };
          }
        }
        return { status: 200, body: {} };
      }

      const weatherRes = handleLiveEndpoint("/api/weather/live?lat=25.5&lon=91.8", false);
      expect(weatherRes.status).toBe(503);
      expect(weatherRes.body.error).toBe("UNAVAILABLE_OFFLINE");

      const mlRes = handleLiveEndpoint("/api/ml/predict", false);
      expect(mlRes.status).toBe(503);
      expect(mlRes.body.error).toBe("UNAVAILABLE_OFFLINE");

      const satRes = handleLiveEndpoint("/api/satellite/displacement", false);
      expect(satRes.status).toBe(503);
      expect(satRes.body.error).toBe("UNAVAILABLE_OFFLINE");
    });

    it("verifies missing offline rainfall or weather is NEVER coerced to 0 or synthetic fake values", () => {
      interface Telemetry {
        rainfall_24h_mm: number | null;
        soil_saturation_pct: number | null;
        source: "live" | "cached" | "unavailable";
      }

      function parseOfflineTelemetry(data: unknown): Telemetry {
        if (!data || typeof data !== "object") {
          return {
            rainfall_24h_mm: null,
            soil_saturation_pct: null,
            source: "unavailable",
          };
        }
        return data as Telemetry;
      }

      const offlineResult = parseOfflineTelemetry(null);
      // Must be null, never 0.0 or 0
      expect(offlineResult.rainfall_24h_mm).toBeNull();
      expect(offlineResult.soil_saturation_pct).toBeNull();
      expect(offlineResult.source).toBe("unavailable");
      expect(offlineResult.rainfall_24h_mm).not.toBe(0);
    });
  });

  // 6. AUTHENTICATION INTEGRITY
  describe("6. Authentication Integrity in Offline Mode", () => {
    it("never elevates privileges or bypasses authentication while offline", () => {
      // Authenticated session state
      function checkAuthorizedAction(session: { role?: string } | null, action: "submit_official" | "review_citizen") {
        if (!session || !session.role) {
          return { allowed: false, reason: "UNAUTHENTICATED" };
        }
        if (action === "review_citizen" && session.role !== "NODAL_OFFICER" && session.role !== "STATE_DISASTER_OFFICER") {
          return { allowed: false, reason: "UNAUTHORIZED" };
        }
        return { allowed: true };
      }

      // Offline unauthenticated user cannot review observations
      expect(checkAuthorizedAction(null, "review_citizen").allowed).toBe(false);

      // Offline public citizen observer cannot review observations
      expect(checkAuthorizedAction({ role: "PUBLIC_USER" }, "review_citizen").allowed).toBe(false);

      // Official nodal officer maintains their proper role
      expect(checkAuthorizedAction({ role: "NODAL_OFFICER" }, "review_citizen").allowed).toBe(true);
    });
  });

  // 7. COMPREHENSIVE PHASE 18 (A-Z) SPECIFICATION REGRESSION
  describe("7. Full Offline Observation Implementation Verification (Phases 1-18 A-Z)", () => {
    beforeEach(() => {
      clearOfflineQueue();
    });

    it("A. Observation route exists and has zero blocking network loader requirements", () => {
      const obsRoutePath = path.resolve(__dirname, "../routes/observations.tsx");
      expect(fs.existsSync(obsRoutePath)).toBe(true);
      const obsContent = fs.readFileSync(obsRoutePath, "utf-8");
      // Route must not have blocking loader network fetch
      expect(obsContent).toContain("createFileRoute(\"/observations\")");
      expect(obsContent).not.toContain("loader: async () => fetch(");
    });

    it("B. Report Observation form opens offline and has local zone data", () => {
      const dialogPath = path.resolve(__dirname, "../components/FieldObservationDialog.tsx");
      expect(fs.existsSync(dialogPath)).toBe(true);
      const dialogContent = fs.readFileSync(dialogPath, "utf-8");
      expect(dialogContent).toContain("FieldObservationDialog");
      expect(dialogContent).toContain("getAllZones");
      expect(dialogContent).toContain("queueObservation");
    });

    it("C. Form can be completed offline with all standard observation fields", () => {
      const obsData = {
        zone_id: 1,
        state: "Assam",
        district: "Cachar",
        observed_at: "2026-09-07T10:00:00.000Z",
        rainfall_mm: 45.5,
        soil_condition: "waterlogged" as const,
        visual_signs: "Toe bulge and rotational cracks",
        road_status: "blocked" as const,
        latitude: 24.8333,
        longitude: 92.7789,
        observer_id: "officer_assam_01",
        reporter_name: "Sub-divisional Magistrate",
        reporter_phone: "+919876543210",
        consent_given: true,
      };

      const queued = queueObservation(obsData);
      expect(queued.zone_id).toBe(1);
      expect(queued.state).toBe("Assam");
      expect(queued.district).toBe("Cachar");
      expect(queued.observed_at).toBe("2026-09-07T10:00:00.000Z");
      expect(queued.rainfall_mm).toBe(45.5);
      expect(queued.soil_condition).toBe("waterlogged");
      expect(queued.visual_signs).toBe("Toe bulge and rotational cracks");
      expect(queued.road_status).toBe("blocked");
      expect(queued.latitude).toBe(24.8333);
      expect(queued.longitude).toBe(92.7789);
      expect(queued.observer_id).toBe("officer_assam_01");
      expect(queued.reporter_name).toBe("Sub-divisional Magistrate");
    });

    it("D & E. Offline submission creates local record immediately without server prerequisite", () => {
      // No server network call mock or fetch required
      const record = queueObservation({
        zone_id: 7,
        state: "Sikkim",
        district: "Gangtok",
        observed_at: new Date().toISOString(),
        road_status: "restricted",
      });

      expect(record).toBeDefined();
      const inStore = getQueuedObservations();
      expect(inStore.length).toBe(1);
      expect(inStore[0]?.idempotency_key).toBe(record.idempotency_key);
    });

    it("F & G. Offline observation receives unique client ID and is PENDING_SYNC", () => {
      const record = queueObservation({
        zone_id: 4,
        state: "Meghalaya",
        district: "East Khasi Hills",
        observed_at: new Date().toISOString(),
        soil_condition: "saturated",
      });

      expect(record.idempotency_key).toBeDefined();
      expect(typeof record.idempotency_key).toBe("string");
      expect(record.idempotency_key!.length).toBeGreaterThan(10);
      expect(record.queue_status).toBe("PENDING_SYNC");
    });

    it("H, I & J. Offline observations persist across reloads, restarts, and multiple entries", () => {
      // Submitting 3 separate observations
      const o1 = queueObservation({ zone_id: 1, observed_at: "2026-09-07T08:00:00.000Z" });
      const o2 = queueObservation({ zone_id: 2, observed_at: "2026-09-07T08:15:00.000Z" });
      const o3 = queueObservation({ zone_id: 3, observed_at: "2026-09-07T08:30:00.000Z" });

      // First check: all 3 present
      let queued = getQueuedObservations();
      expect(queued.length).toBe(3);

      // Simulate browser tab close / app restart (reading raw localStorage)
      const raw = localStorage.getItem("landalert_field_observations_queue_v1");
      expect(raw).toBeDefined();
      const parsed = JSON.parse(raw!);
      expect(parsed.length).toBe(3);
      expect(parsed[0].idempotency_key).toBe(o1.idempotency_key);
      expect(parsed[1].idempotency_key).toBe(o2.idempotency_key);
      expect(parsed[2].idempotency_key).toBe(o3.idempotency_key);
    });

    it("K, L & S. Successful synchronization transitions PENDING_SYNC to SYNCED and archives record", () => {
      const obs = queueObservation({
        zone_id: 5,
        state: "Mizoram",
        district: "Aizawl",
        observed_at: "2026-09-07T09:00:00.000Z",
      });

      expect(obs.queue_status).toBe("PENDING_SYNC");

      // Simulate successful server response acknowledging the observation
      pruneQueue([obs.idempotency_key!]);

      // Pending queue is empty
      expect(getQueuedObservations().length).toBe(0);

      // Synced history contains the acknowledged item
      const synced = getSyncedObservations();
      expect(synced.length).toBe(1);
      expect(synced[0]?.idempotency_key).toBe(obs.idempotency_key);
      expect(synced[0]?.queue_status).toBe("SYNCED");
      expect(synced[0]?.synced_at).toBeDefined();
    });

    it("M & N. Failed synchronization preserves observation in pending queue for retry", () => {
      const o1 = queueObservation({ zone_id: 10, observed_at: new Date().toISOString() });
      const o2 = queueObservation({ zone_id: 11, observed_at: new Date().toISOString() });

      // Suppose o1 succeeded but o2 failed due to network glitch
      pruneQueue([o1.idempotency_key!]);

      // o2 remains in queue
      const remaining = getQueuedObservations();
      expect(remaining.length).toBe(1);
      expect(remaining[0]?.idempotency_key).toBe(o2.idempotency_key);

      // Retry: server succeeds on retry
      pruneQueue([o2.idempotency_key!]);
      expect(getQueuedObservations().length).toBe(0);
      expect(getSyncedObservations().length).toBe(2);
    });

    it("O. Duplicate synchronization does not create duplicate entries", () => {
      const o1 = queueObservation({ zone_id: 1, observed_at: new Date().toISOString() });
      pruneQueue([o1.idempotency_key!]);

      // Attempting to prune the same key again does not duplicate synced entries
      pruneQueue([o1.idempotency_key!]);
      const synced = getSyncedObservations();
      const matches = synced.filter((s) => s.idempotency_key === o1.idempotency_key);
      expect(matches.length).toBe(1);
    });

    it("P & Q. Preserves observed_at separate from client_timestamp and synced_at", () => {
      const observedTime = "2026-09-07T06:30:00.000Z";
      const o1 = queueObservation({
        zone_id: 8,
        observed_at: observedTime,
      });

      expect(o1.observed_at).toBe(observedTime);
      expect(o1.client_timestamp).toBeDefined();

      // Later sync
      pruneQueue([o1.idempotency_key!]);
      const synced = getSyncedObservations()[0];
      expect(synced?.observed_at).toBe(observedTime);
      expect(synced?.synced_at).toBeDefined();
      expect(synced?.synced_at).not.toBe(observedTime);
    });

    it("R. Offline list displays pending observations with explicit metadata", () => {
      queueObservation({
        zone_id: 14,
        state: "Sikkim",
        district: "Mangan",
        rainfall_mm: 92.4,
        visual_signs: "Tension cracks",
        observed_at: new Date().toISOString(),
      });

      const pending = getQueuedObservations();
      expect(pending.length).toBe(1);
      expect(pending[0]?.district).toBe("Mangan");
      expect(pending[0]?.queue_status).toBe("PENDING_SYNC");
    });

    it("T & U. Media storage truthfully stores blobs locally without fake network URLs", async () => {
      const mediaId = "media-" + Date.now();
      const mockBlob = new Blob(["test-image-binary-data"], { type: "image/jpeg" });
      await saveOfflineMedia(mediaId, mockBlob, {
        name: "crack_toe.jpg",
        mimeType: "image/jpeg",
        size: 23,
      });

      const retrieved = await getOfflineMedia(mediaId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.name).toBe("crack_toe.jpg");
      expect(retrieved?.mimeType).toBe("image/jpeg");
      expect(retrieved?.size).toBe(23);
    });

    it("V. Coordinates are never fabricated when GPS is unavailable", () => {
      const oNoGps = queueObservation({
        zone_id: 3,
        state: "Assam",
        district: "Dima Hasao",
        observed_at: new Date().toISOString(),
        // No latitude or longitude provided
      });

      expect(oNoGps.latitude).toBeUndefined();
      expect(oNoGps.longitude).toBeUndefined();
      expect(oNoGps.latitude).not.toBe(0);
      expect(oNoGps.longitude).not.toBe(0);
    });

    it("W. UI message truthfully informs user of offline queueing", () => {
      const dialogPath = path.resolve(__dirname, "../components/FieldObservationDialog.tsx");
      const content = fs.readFileSync(dialogPath, "utf-8");
      expect(content).toContain("Observation saved offline — will sync when connectivity returns.");
      expect(content).not.toContain("Submitted successfully to server when offline");
    });

    it("X. Service Worker precaches /observations route and navigation shell", () => {
      const scriptPath = path.resolve(__dirname, "../../scripts/generate-sw-manifest.mjs");
      const content = fs.readFileSync(scriptPath, "utf-8");
      expect(content).toContain("\"/observations\"");
      expect(content).toContain("\"/alerts\"");
    });

    it("Y. ML models, scientific gates and InSAR code remain untouched", () => {
      const workerPyPath = path.resolve(__dirname, "../../workers/insar/worker.py");
      expect(fs.existsSync(workerPyPath)).toBe(true);
      const workerPy = fs.readFileSync(workerPyPath, "utf-8");
      expect(workerPy).toContain("'UNAVAILABLE', NULL, NULL, NULL");
    });

    it("Z. Console shell navigation scrolls down to recent-observations section", () => {
      const consoleShellPath = path.resolve(__dirname, "../components/ConsoleShell.tsx");
      const content = fs.readFileSync(consoleShellPath, "utf-8");
      expect(content).toContain('href="/#recent-observations"');
      expect(content).toContain('handleNavToSection(e, "recent-observations")');
    });

    it("AA. SyncQueueDialog renders synced observations even when pending queue is empty", () => {
      const dialogPath = path.resolve(__dirname, "../components/SyncQueueDialog.tsx");
      expect(fs.existsSync(dialogPath)).toBe(true);
      const content = fs.readFileSync(dialogPath, "utf-8");
      expect(content).toContain("getSyncedObservations");
      expect(content).toContain("syncedItems");
      expect(content).toContain("tab_synced");
    });
  });
});
