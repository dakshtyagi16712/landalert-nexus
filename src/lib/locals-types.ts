/**
 * src/lib/locals-types.ts
 * =======================
 * Pure client/server-safe types and normalization helpers for the LOCALS subsystem.
 * Free of any database or server-only dependencies.
 */

export type LocalsReportType = "crack" | "slope_movement" | "road_blocked" | "other";

export type LocalsDetectionMethod = "gps_proximity" | "zone_fallback";

export type LocalsAlertStatus = "ACTIVE" | "RESOLVED" | "DISMISSED";

export type LocalsResolutionAction = "CONFIRMED_HAZARD" | "FALSE_PATTERN";

export interface LocalsObservationLike {
  id: number | string;
  zone_id: number;
  observed_at?: string | null;
  created_at?: string | null;
  report_type?: string | null;
  visual_signs?: string | null;
  road_status?: string | null;
  geo_lat?: number | null;
  geo_lng?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string | null;
  review_status?: string | null;
}

export interface LocalsAlertRecord {
  id: number;
  report_type: LocalsReportType;
  center_lat: number | null;
  center_lng: number | null;
  observation_count: number;
  triggering_observation_ids: number[];
  zone_ids_involved: number[];
  detection_method: LocalsDetectionMethod;
  first_observed_at: string;
  triggered_at: string;
  status: LocalsAlertStatus;
  resolved_by?: string | null;
  resolved_at?: string | null;
  resolution_note?: string | null;
  resolution_action?: LocalsResolutionAction | null;
}

/**
 * Derives the canonical report type for an observation.
 * 
 * Priority order:
 * 1. Explicit report_type enum if already present and valid.
 * 2. Visual slope failure indicators ("crack" or "slope_movement") take FIRST priority
 *    so a slope failure that also impacts a road is correctly identified by its root cause.
 * 3. road_status === "blocked" ONLY if visual signs are empty / "None observed".
 * 4. Fallback to "other".
 */
export function extractReportType(obs: {
  report_type?: string | null;
  visual_signs?: string | null;
  road_status?: string | null;
}): LocalsReportType {
  // 1. Explicit canonical enum field
  if (obs.report_type) {
    const norm = obs.report_type.toLowerCase();
    if (norm === "crack" || norm === "slope_movement" || norm === "road_blocked" || norm === "other") {
      return norm as LocalsReportType;
    }
  }

  const signs = (obs.visual_signs || "").trim().toLowerCase();
  const hasVisualSign = signs.length > 0 && signs !== "none" && signs !== "none observed";

  // 2. Visual slope failure signs FIRST
  if (hasVisualSign) {
    if (signs.includes("crack")) {
      return "crack";
    }
    if (
      signs.includes("mudflow") ||
      signs.includes("slump") ||
      signs.includes("tilting") ||
      signs.includes("rockfall") ||
      signs.includes("slope")
    ) {
      return "slope_movement";
    }
  }

  // 3. Pure road blockage with NO visual slope failure sign
  if (obs.road_status === "blocked") {
    return "road_blocked";
  }

  return "other";
}
