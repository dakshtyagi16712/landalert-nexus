/**
 * src/lib/locals-escalation.test.ts
 * =================================
 * Comprehensive unit tests for LOCALS auto-escalation engine:
 * 1. Haversine distance accuracy
 * 2. extractReportType() prioritization (visual signs crack/slope_movement FIRST, road_status fallback only when no visual signs)
 * 3. GPS-proximity clustering (10+ observations, <=500m, <=1h window)
 * 4. Zone fallback clustering (10+ observations with null lat/lng in same zone)
 * 5. Strict non-mixing (GPS-bearing and GPS-lacking never combined)
 * 6. Overlap suppression (>50% shared IDs)
 * 7. LOCALS alert persistence and resolution lifecycle
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  haversineDistanceMeters,
  extractReportType,
  evaluateObservationsForLocalsEscalation,
  resolveLocalsAlert,
  getActiveLocalsAlerts,
  resetLocalsAlertStoreForTesting,
  LOCALS_CONSTANTS,
  type PendingObservationRow,
} from "./locals-escalation.service";

describe("LOCALS Escalation Service", () => {
  beforeEach(() => {
    resetLocalsAlertStoreForTesting();
  });

  describe("Haversine Distance Calculation", () => {
    it("returns 0 for identical coordinates", () => {
      const dist = haversineDistanceMeters(25.3, 91.72, 25.3, 91.72);
      expect(dist).toBeCloseTo(0, 1);
    });

    it("accurately calculates short distances (~500m)", () => {
      // 1 degree of latitude is roughly 111,139 meters.
      // 0.0045 degrees lat is ~500.1 meters.
      const dist = haversineDistanceMeters(25.3, 91.72, 25.3045, 91.72);
      expect(dist).toBeGreaterThan(490);
      expect(dist).toBeLessThan(510);
    });

    it("accurately calculates distances beyond the 500m threshold", () => {
      // Shillong (25.5788, 91.8933) to Cherrapunji / Sohra (25.2986, 91.7324) is ~35km
      const dist = haversineDistanceMeters(25.5788, 91.8933, 25.2986, 91.7324);
      expect(dist).toBeGreaterThan(30000);
      expect(dist).toBeLessThan(40000);
    });
  });

  describe("extractReportType Priority Logic", () => {
    it("preserves explicitly specified valid report_type enums", () => {
      expect(extractReportType({ report_type: "crack" })).toBe("crack");
      expect(extractReportType({ report_type: "slope_movement" })).toBe("slope_movement");
      expect(extractReportType({ report_type: "road_blocked" })).toBe("road_blocked");
      expect(extractReportType({ report_type: "other" })).toBe("other");
    });

    it("prioritizes tension cracks over blocked road (visual signs FIRST)", () => {
      const res = extractReportType({
        visual_signs: "Tension cracks on slope",
        road_status: "blocked",
      });
      // Crucial requirement: slope failure with blocked road must NOT be demoted to road_blocked
      expect(res).toBe("crack");
    });

    it("prioritizes mudflow/slumping over blocked road (visual signs FIRST)", () => {
      const res = extractReportType({
        visual_signs: "Mudflow / Slumping",
        road_status: "blocked",
      });
      // Hazard early-warning priority: slope_movement hazard comes before road blockage
      expect(res).toBe("slope_movement");
    });

    it("prioritizes rockfall over blocked road", () => {
      const res = extractReportType({
        visual_signs: "Rockfall debris",
        road_status: "blocked",
      });
      expect(res).toBe("slope_movement");
    });

    it("falls back to road_blocked ONLY when visual_signs is 'None observed' or empty AND road is blocked", () => {
      const withNone = extractReportType({
        visual_signs: "None observed",
        road_status: "blocked",
      });
      expect(withNone).toBe("road_blocked");

      const withEmpty = extractReportType({
        visual_signs: "",
        road_status: "blocked",
      });
      expect(withEmpty).toBe("road_blocked");

      const withUndefined = extractReportType({
        road_status: "blocked",
      });
      expect(withUndefined).toBe("road_blocked");
    });

    it("returns 'other' if no visual slope signs and road is not blocked", () => {
      const res = extractReportType({
        visual_signs: "None observed",
        road_status: "passable",
      });
      expect(res).toBe("other");
    });

    it("correctly derives canonical type for legacy observations where report_type is null", () => {
      // Legacy rows before column was added have report_type: null
      const legacyCrack = extractReportType({
        report_type: null,
        visual_signs: "Tension cracks on slope",
        road_status: "passable",
      });
      expect(legacyCrack).toBe("crack");

      const legacyMudflow = extractReportType({
        report_type: null,
        visual_signs: "Mudflow / Slumping",
        road_status: "blocked",
      });
      expect(legacyMudflow).toBe("slope_movement");

      const legacyFallenTree = extractReportType({
        report_type: null,
        visual_signs: "None observed",
        road_status: "blocked",
      });
      expect(legacyFallenTree).toBe("road_blocked");
    });
  });

  describe("Clustering & Threshold Rules", () => {
    const now = new Date();

    const makeGpsObs = (
      id: string,
      latOffset = 0,
      lngOffset = 0,
      reportType: any = "slope_movement",
      minutesAgo = 10,
    ): PendingObservationRow => ({
      id,
      user_id: `user_${id}`,
      zone_id: 5,
      hazard_type: "landslide",
      report_type: reportType,
      latitude: 25.3 + latOffset,
      longitude: 91.72 + lngOffset,
      road_status: "blocked",
      visual_signs: "Mudflow / Slumping",
      created_at: new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString(),
    });

    it("does NOT trigger an escalation alert if fewer than 10 observations exist", async () => {
      // 9 observations within 200m
      const observations = Array.from({ length: 9 }, (_, i) =>
        makeGpsObs(`obs_${i + 1}`, 0.0005 * i, 0.0005 * i, "slope_movement", 15)
      );

      const alerts = await evaluateObservationsForLocalsEscalation(observations);
      expect(alerts).toHaveLength(0);
    });

    it("triggers a GPS LOCALS alert when 10+ matching observations occur within 500m in 1 hour", async () => {
      // 10 observations clustered tightly within ~100m of (25.3, 91.72)
      const observations = Array.from({ length: 10 }, (_, i) =>
        makeGpsObs(`obs_${i + 1}`, 0.0002 * i, 0.0002 * i, "slope_movement", 20)
      );

      const alerts = await evaluateObservationsForLocalsEscalation(observations);
      expect(alerts.length).toBeGreaterThanOrEqual(1);

      const alert = alerts[0];
      expect(alert.report_type).toBe("slope_movement");
      expect(alert.detection_method).toBe("gps_proximity");
      expect(alert.observation_count).toBe(10);
      expect(alert.status).toBe("ACTIVE");
      expect(alert.center_lat).toBeCloseTo(25.3009, 3);
      expect(alert.center_lng).toBeCloseTo(91.7209, 3);
    });

    it("does NOT cluster observations with different report_types together", async () => {
      // 5 crack + 5 slope_movement at the exact same location
      const cracks = Array.from({ length: 5 }, (_, i) =>
        makeGpsObs(`crack_${i + 1}`, 0, 0, "crack", 10)
      );
      const slopes = Array.from({ length: 5 }, (_, i) =>
        makeGpsObs(`slope_${i + 1}`, 0, 0, "slope_movement", 10)
      );

      const combined = [...cracks, ...slopes];
      const alerts = await evaluateObservationsForLocalsEscalation(combined);
      expect(alerts).toHaveLength(0);
    });

    it("does NOT cluster observations separated by >500 meters", async () => {
      // 10 observations spaced 0.01 degrees apart (~1.1 km apart)
      const distantObs = Array.from({ length: 10 }, (_, i) =>
        makeGpsObs(`dist_${i + 1}`, 0.01 * i, 0, "slope_movement", 10)
      );

      const alerts = await evaluateObservationsForLocalsEscalation(distantObs);
      expect(alerts).toHaveLength(0);
    });

    it("does NOT include observations outside the rolling 1-hour window", async () => {
      // 9 recent observations (15 mins ago) + 1 old observation (90 mins ago)
      const recent = Array.from({ length: 9 }, (_, i) =>
        makeGpsObs(`rec_${i + 1}`, 0.0001 * i, 0, "slope_movement", 15)
      );
      const old = makeGpsObs("old_10", 0, 0, "slope_movement", 90);

      const alerts = await evaluateObservationsForLocalsEscalation([...recent, old]);
      expect(alerts).toHaveLength(0);
    });

    it("clusters legacy observations where report_type is null using visual_signs and road_status", async () => {
      // 10 legacy observations with report_type explicitly set to null
      const legacyObs = Array.from({ length: 10 }, (_, i) =>
        makeGpsObs(`legacy_${i + 1}`, 0.0002 * i, 0.0002 * i, null, 20)
      );

      const alerts = await evaluateObservationsForLocalsEscalation(legacyObs);
      expect(alerts.length).toBeGreaterThanOrEqual(1);
      expect(alerts[0].report_type).toBe("slope_movement");
      expect(alerts[0].observation_count).toBe(10);
    });
  });

  describe("Zone Fallback Clustering & Strict Non-Mixing", () => {
    const now = new Date();

    const makeNoGpsObs = (
      id: string,
      zoneId = 5,
      reportType: any = "crack",
      minutesAgo = 10,
    ): PendingObservationRow => ({
      id,
      user_id: `user_${id}`,
      zone_id: zoneId,
      hazard_type: "landslide",
      report_type: reportType,
      latitude: null,
      longitude: null,
      visual_signs: "Tension cracks on slope",
      created_at: new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString(),
    });

    it("clusters 10+ observations lacking GPS by zone_id within 1 hour", async () => {
      const zoneObs = Array.from({ length: 10 }, (_, i) =>
        makeNoGpsObs(`no_gps_${i + 1}`, 5, "crack", 15)
      );

      const alerts = await evaluateObservationsForLocalsEscalation(zoneObs);
      expect(alerts.length).toBeGreaterThanOrEqual(1);

      const alert = alerts[0];
      expect(alert.detection_method).toBe("zone_fallback");
      expect(alert.zone_ids_involved).toContain(5);
      expect(alert.observation_count).toBe(10);
      expect(alert.status).toBe("ACTIVE");
    });

    it("strictly isolates GPS and non-GPS observations from being merged into one cluster", async () => {
      // 5 GPS-bearing observations + 5 GPS-lacking observations in zone 5
      const gpsObs = Array.from({ length: 5 }, (_, i) => ({
        id: `mixed_gps_${i + 1}`,
        user_id: `user_gps_${i}`,
        zone_id: 5,
        hazard_type: "landslide",
        report_type: "crack" as const,
        latitude: 25.3,
        longitude: 91.72,
        visual_signs: "Tension cracks on slope",
        created_at: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      }));

      const noGpsObs = Array.from({ length: 5 }, (_, i) =>
        makeNoGpsObs(`mixed_nogps_${i + 1}`, 5, "crack", 10)
      );

      const alerts = await evaluateObservationsForLocalsEscalation([...gpsObs, ...noGpsObs]);
      // Neither group reaches the required 10 threshold independently!
      expect(alerts).toHaveLength(0);
    });
  });

  describe("Overlap Suppression & Resolution Lifecycle", () => {
    it("suppresses duplicate alert creation when candidate shares >50% observations with active alert", async () => {
      const now = new Date();
      // First 10 observations generate an active alert
      const obsBatch1 = Array.from({ length: 10 }, (_, i) => ({
        id: `suppress_obs_${i + 1}`,
        user_id: `user_${i}`,
        zone_id: 11,
        hazard_type: "landslide",
        report_type: "slope_movement" as const,
        latitude: 27.33 + 0.0001 * i,
        longitude: 88.61,
        created_at: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      }));

      const firstAlerts = await evaluateObservationsForLocalsEscalation(obsBatch1);
      expect(firstAlerts.length).toBeGreaterThanOrEqual(1);

      // Now evaluate a second candidate that includes 8 of the same observations + 2 new ones (80% overlap)
      const obsBatch2 = [
        ...obsBatch1.slice(0, 8),
        {
          id: "suppress_obs_11",
          user_id: "user_11",
          zone_id: 11,
          hazard_type: "landslide",
          report_type: "slope_movement" as const,
          latitude: 27.3305,
          longitude: 88.6105,
          created_at: new Date().toISOString(),
        },
        {
          id: "suppress_obs_12",
          user_id: "user_12",
          zone_id: 11,
          hazard_type: "landslide",
          report_type: "slope_movement" as const,
          latitude: 27.3306,
          longitude: 88.6106,
          created_at: new Date().toISOString(),
        },
      ];

      const secondRun = await evaluateObservationsForLocalsEscalation(obsBatch2);
      // Suppressed because an active alert already covers this event cluster
      expect(secondRun).toHaveLength(0);
    });

    it("rejects resolution from unauthorized public users", async () => {
      const now = new Date();
      const obsBatch = Array.from({ length: 10 }, (_, i) => ({
        id: `auth_obs_${i + 1}`,
        user_id: `user_${i}`,
        zone_id: 11,
        hazard_type: "landslide",
        report_type: "slope_movement" as const,
        latitude: 27.33 + 0.0001 * i,
        longitude: 88.61,
        created_at: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      }));
      const created = await evaluateObservationsForLocalsEscalation(obsBatch);
      expect(created.length).toBeGreaterThan(0);

      const alertId = created[0].id;
      const unauthResult = await resolveLocalsAlert(
        alertId,
        "FALSE_PATTERN",
        "Citizen trying to dismiss alert without authority.",
        { email: "citizen@example.com", role: "PUBLIC_USER" }
      );
      expect(unauthResult.success).toBe(false);
      expect(unauthResult.error).toContain("Unauthorized");
    });

    it("resolves an active LOCALS alert by an authorized official with audit logging", async () => {
      const now = new Date();
      const obsBatch = Array.from({ length: 10 }, (_, i) => ({
        id: `res_obs_${i + 1}`,
        user_id: `user_${i}`,
        zone_id: 11,
        hazard_type: "landslide",
        report_type: "slope_movement" as const,
        latitude: 27.33 + 0.0001 * i,
        longitude: 88.61,
        created_at: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      }));
      const created = await evaluateObservationsForLocalsEscalation(obsBatch);
      expect(created.length).toBeGreaterThan(0);

      const alertToResolve = created[0];
      const result = await resolveLocalsAlert(
        alertToResolve.id,
        "CONFIRMED_HAZARD",
        "GSI team on ground verified tension cracks actively widening.",
        { email: "official@gsi.gov.in", role: "VERIFIED_OFFICIAL" }
      );

      expect(result.success).toBe(true);
      expect(result.alert?.status).toBe("RESOLVED");
      expect(result.alert?.resolution_action).toBe("CONFIRMED_HAZARD");
      expect(result.alert?.resolved_by).toBe("VERIFIED_OFFICIAL:official@gsi.gov.in");
      expect(result.alert?.resolution_note).toContain("GSI team on ground");
      expect(result.alert?.resolved_at).toBeDefined();
    });
  });
});
