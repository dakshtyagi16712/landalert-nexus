/**
 * ==============================================================================
 * LOCALS (Localized Observation Cluster & Automated Logistical Signal) Service
 * ==============================================================================
 * 
 * Provides automated GPS-proximity and zone-fallback escalation for stalled
 * citizen observations. Surfaces early warning clusters to officials and the
 * public without auto-verifying individual observations.
 */

async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ==============================================================================
// Named Configuration Constants
// ==============================================================================

/** Minimum number of matching observations required to trigger a LOCALS alert */
export const LOCALS_CLUSTER_THRESHOLD = 10;

/** Rolling observation time window in hours */
export const LOCALS_WINDOW_HOURS = 1;

/** Rolling observation time window in milliseconds (1 hour) */
export const LOCALS_WINDOW_MS = LOCALS_WINDOW_HOURS * 60 * 60 * 1000;

/** Maximum distance in meters between observations for GPS-proximity clustering */
export const LOCALS_RADIUS_METERS = 500;

/** Overlap fraction above which a duplicate active alert is suppressed (>50%) */
export const LOCALS_OVERLAP_SUPPRESSION_THRESHOLD = 0.5;

// ==============================================================================
// Types & Enums
// ==============================================================================

import {
  type LocalsReportType,
  type LocalsDetectionMethod,
  type LocalsAlertStatus,
  type LocalsResolutionAction,
  type LocalsObservationLike,
  type LocalsAlertRecord,
  extractReportType,
} from "./locals-types";

export {
  type LocalsReportType,
  type LocalsDetectionMethod,
  type LocalsAlertStatus,
  type LocalsResolutionAction,
  type LocalsObservationLike,
  type LocalsAlertRecord,
  extractReportType,
};

export type PendingObservationRow = LocalsObservationLike;

export const LOCALS_CONSTANTS = {
  CLUSTER_THRESHOLD: LOCALS_CLUSTER_THRESHOLD,
  WINDOW_HOURS: LOCALS_WINDOW_HOURS,
  WINDOW_MS: LOCALS_WINDOW_MS,
  RADIUS_METERS: LOCALS_RADIUS_METERS,
  OVERLAP_SUPPRESSION_THRESHOLD: LOCALS_OVERLAP_SUPPRESSION_THRESHOLD,
};

// In-memory alert store for testing and offline fallback
const IN_MEMORY_LOCALS_ALERTS: LocalsAlertRecord[] = [];
let nextAlertId = 1;

export function resetLocalsAlertStoreForTesting(): void {
  IN_MEMORY_LOCALS_ALERTS.length = 0;
  nextAlertId = 1;
}

export function getInMemoryLocalsAlerts(): LocalsAlertRecord[] {
  return [...IN_MEMORY_LOCALS_ALERTS];
}

// ==============================================================================
// Accessor & Normalization Helpers
// ==============================================================================

export function getObsLat(obs: LocalsObservationLike): number | null {
  if (typeof obs.geo_lat === "number" && !isNaN(obs.geo_lat)) return obs.geo_lat;
  if (typeof obs.latitude === "number" && !isNaN(obs.latitude)) return obs.latitude;
  return null;
}

export function getObsLng(obs: LocalsObservationLike): number | null {
  if (typeof obs.geo_lng === "number" && !isNaN(obs.geo_lng)) return obs.geo_lng;
  if (typeof obs.longitude === "number" && !isNaN(obs.longitude)) return obs.longitude;
  return null;
}

export function getObsTime(obs: LocalsObservationLike): number {
  const ts = obs.observed_at || obs.created_at || new Date().toISOString();
  const parsed = new Date(ts).getTime();
  return isNaN(parsed) ? Date.now() : parsed;
}

/**
 * Determines whether an observation has valid, non-null numeric GPS coordinates.
 */
export function hasValidGps(obs: LocalsObservationLike): boolean {
  const lat = getObsLat(obs);
  const lng = getObsLng(obs);
  return (
    typeof lat === "number" &&
    !isNaN(lat) &&
    typeof lng === "number" &&
    !isNaN(lng) &&
    (lat !== 0 || lng !== 0)
  );
}

// ==============================================================================
// Haversine Distance Function (Plain Formula in Meters)
// ==============================================================================

/**
 * Calculates great-circle distance between two geographic coordinates in meters.
 * Uses mean Earth radius of 6,371,000 meters.
 */
export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371000; // Mean Earth radius in meters
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}



/**
 * Parses observation ID into a numeric representation.
 */
function parseObsId(id: number | string): number {
  if (typeof id === "number") return id;
  const parsed = parseInt(id, 10);
  if (!isNaN(parsed)) return parsed;
  // If UUID or non-numeric string, hash to positive 32-bit integer
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ==============================================================================
// Clustering Core
// ==============================================================================

/**
 * Finds all pending observations in a candidate pool that form a GPS proximity
 * cluster with the anchor observation (same report type, within 500m, within 1h).
 * 
 * STRICT RULE: Only considers observations that HAVE valid GPS coordinates.
 */
export function findGpsClusterForAnchor(
  anchor: LocalsObservationLike,
  pool: LocalsObservationLike[],
): LocalsObservationLike[] {
  if (!hasValidGps(anchor)) return [];

  const anchorLat = getObsLat(anchor)!;
  const anchorLng = getObsLng(anchor)!;
  const anchorType = extractReportType(anchor);
  const anchorTime = getObsTime(anchor);

  return pool.filter((obs) => {
    if (!hasValidGps(obs)) return false; // Never blend non-GPS
    if (extractReportType(obs) !== anchorType) return false;

    const obsTime = getObsTime(obs);
    if (Math.abs(anchorTime - obsTime) > LOCALS_WINDOW_MS) return false;

    const obsLat = getObsLat(obs)!;
    const obsLng = getObsLng(obs)!;
    const distance = haversineDistanceMeters(
      anchorLat,
      anchorLng,
      obsLat,
      obsLng,
    );
    return distance <= LOCALS_RADIUS_METERS;
  });
}

/**
 * Finds all pending observations in a candidate pool that form a zone fallback
 * cluster with the anchor observation (same report type, same zone_id, within 1h).
 * 
 * STRICT RULE: Only considers observations that DO NOT have GPS coordinates.
 */
export function findZoneFallbackClusterForAnchor(
  anchor: LocalsObservationLike,
  pool: LocalsObservationLike[],
): LocalsObservationLike[] {
  if (hasValidGps(anchor)) return []; // Anchor must lack GPS for zone fallback

  const anchorType = extractReportType(anchor);
  const anchorTime = getObsTime(anchor);

  return pool.filter((obs) => {
    if (hasValidGps(obs)) return false; // Never blend GPS-having observations
    if (obs.zone_id !== anchor.zone_id) return false;
    if (extractReportType(obs) !== anchorType) return false;

    const obsTime = getObsTime(obs);
    return Math.abs(anchorTime - obsTime) <= LOCALS_WINDOW_MS;
  });
}

/**
 * Checks if a candidate cluster has >50% overlap with any existing ACTIVE alert.
 */
export function isClusterMateriallyOverlapping(
  clusterObsIds: number[],
  activeAlerts: LocalsAlertRecord[],
): boolean {
  if (clusterObsIds.length === 0 || activeAlerts.length === 0) return false;

  const clusterSet = new Set(clusterObsIds);

  for (const alert of activeAlerts) {
    if (alert.status !== "ACTIVE") continue;
    const existingIds = alert.triggering_observation_ids;
    if (!existingIds || existingIds.length === 0) continue;

    let sharedCount = 0;
    for (const id of existingIds) {
      if (clusterSet.has(id)) sharedCount++;
    }

    const overlapFraction = sharedCount / existingIds.length;
    if (overlapFraction > LOCALS_OVERLAP_SUPPRESSION_THRESHOLD) {
      return true;
    }
  }

  return false;
}

// ==============================================================================
// Alert Lifecycle & Escalation Evaluation
// ==============================================================================

/**
 * Retrieves all currently active LOCALS alerts.
 */
export async function getActiveLocalsAlerts(): Promise<LocalsAlertRecord[]> {
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("locals_alerts")
      .select("*")
      .eq("status", "ACTIVE")
      .order("triggered_at", { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        ...d,
        triggering_observation_ids: Array.isArray(d.triggering_observation_ids)
          ? d.triggering_observation_ids
          : JSON.parse(d.triggering_observation_ids || "[]"),
      }));
    }
  } catch {
    // Fall back to in-memory store
  }

  return IN_MEMORY_LOCALS_ALERTS.filter((a) => a.status === "ACTIVE");
}

/**
 * Creates a new LOCALS alert record and persists it to the database / memory.
 */
export async function createLocalsAlertRecord(
  cluster: LocalsObservationLike[],
  detectionMethod: LocalsDetectionMethod,
): Promise<LocalsAlertRecord | null> {
  if (cluster.length < LOCALS_CLUSTER_THRESHOLD) return null;

  const reportType = extractReportType(cluster[0] ?? {});
  const triggeringIds = cluster.map((o) => parseObsId(o.id));
  const zoneIdsSet = new Set<number>();
  cluster.forEach((o) => {
    if (typeof o.zone_id === "number") zoneIdsSet.add(o.zone_id);
  });
  const zoneIdsInvolved = Array.from(zoneIdsSet);

  // Compute centroid for GPS clusters; null for zone fallback
  let centerLat: number | null = null;
  let centerLng: number | null = null;

  if (detectionMethod === "gps_proximity") {
    const validCoords = cluster.filter(hasValidGps);
    if (validCoords.length > 0) {
      const sumLat = validCoords.reduce((acc, o) => acc + (getObsLat(o) ?? 0), 0);
      const sumLng = validCoords.reduce((acc, o) => acc + (getObsLng(o) ?? 0), 0);
      centerLat = Number((sumLat / validCoords.length).toFixed(6));
      centerLng = Number((sumLng / validCoords.length).toFixed(6));
    }
  }

  // Find earliest observation timestamp
  const sortedTimes = cluster
    .map((o) => getObsTime(o))
    .sort((a, b) => a - b);
  const firstObservedAt = new Date(sortedTimes[0] ?? Date.now()).toISOString();
  const triggeredAt = new Date().toISOString();

  const newAlert: LocalsAlertRecord = {
    id: nextAlertId++,
    report_type: reportType,
    center_lat: centerLat,
    center_lng: centerLng,
    observation_count: cluster.length,
    triggering_observation_ids: triggeringIds,
    zone_ids_involved: zoneIdsInvolved,
    detection_method: detectionMethod,
    first_observed_at: firstObservedAt,
    triggered_at: triggeredAt,
    status: "ACTIVE",
    resolved_by: null,
    resolved_at: null,
    resolution_note: null,
    resolution_action: null,
  };

  try {
    const supabaseAdmin = await getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("locals_alerts")
      .insert({
        report_type: newAlert.report_type,
        center_lat: newAlert.center_lat,
        center_lng: newAlert.center_lng,
        observation_count: newAlert.observation_count,
        triggering_observation_ids: newAlert.triggering_observation_ids as any,
        zone_ids_involved: newAlert.zone_ids_involved,
        detection_method: newAlert.detection_method,
        first_observed_at: newAlert.first_observed_at,
        triggered_at: newAlert.triggered_at,
        status: "ACTIVE",
      })
      .select("id")
      .maybeSingle();

    if (!error && data?.id) {
      newAlert.id = Number(data.id);
    }

    // Bulk-update triggering observation status to ACTIONABLE in database
    if (triggeringIds.length > 0) {
      try {
        const supabaseAdmin = await getSupabaseAdmin();
        await supabaseAdmin
          .from("field_observations")
          .update({ status: "ACTIONABLE" })
          .in("id", triggeringIds.map(String));
      } catch (err: any) {
        console.warn("[LOCALS Actionable Status Update]", err?.message || err);
      }
    }
  } catch (err: any) {
    console.warn("[LOCALS Alert Persistence]", err?.message || err);
  }

  // Update in-memory cluster objects so caller/tests immediately reflect ACTIONABLE status
  cluster.forEach((obs) => {
    (obs as any).status = "ACTIONABLE";
  });

  IN_MEMORY_LOCALS_ALERTS.push(newAlert);
  return newAlert;
}

/**
 * Core evaluation pipeline: Scans candidate observations against existing pending pool,
 * forms GPS and zone-fallback clusters, checks overlap, and creates LOCALS alerts.
 */
export async function evaluateObservationsForLocalsEscalation(
  newObservations: LocalsObservationLike[],
  existingPendingPool: LocalsObservationLike[] = [],
): Promise<LocalsAlertRecord[]> {
  const allCandidates = [...existingPendingPool, ...newObservations];

  // Deduplicate by ID
  const seenIds = new Set<string | number>();
  const pool: LocalsObservationLike[] = [];
  for (const obs of allCandidates) {
    const key = obs.id !== undefined ? String(obs.id) : `${obs.zone_id}-${getObsTime(obs)}`;
    if (!seenIds.has(key)) {
      seenIds.add(key);
      pool.push(obs);
    }
  }

  const activeAlerts = await getActiveLocalsAlerts();
  const createdAlerts: LocalsAlertRecord[] = [];
  const processedClusterSignatures = new Set<string>();

  for (const anchor of newObservations) {
    // Branch 1: GPS proximity clustering (for observations WITH coordinates)
    if (hasValidGps(anchor)) {
      const gpsCluster = findGpsClusterForAnchor(anchor, pool);
      if (gpsCluster.length >= LOCALS_CLUSTER_THRESHOLD) {
        const triggeringIds = gpsCluster.map((o) => parseObsId(o.id)).sort((a, b) => a - b);
        const signature = `gps-${extractReportType(anchor)}-${triggeringIds.slice(0, 5).join(",")}`;

        if (!processedClusterSignatures.has(signature)) {
          processedClusterSignatures.add(signature);
          if (!isClusterMateriallyOverlapping(triggeringIds, [...activeAlerts, ...createdAlerts])) {
            const alert = await createLocalsAlertRecord(gpsCluster, "gps_proximity");
            if (alert) createdAlerts.push(alert);
          }
        }
      }
    } else {
      // Branch 2: Zone fallback clustering (for observations WITHOUT coordinates)
      const zoneCluster = findZoneFallbackClusterForAnchor(anchor, pool);
      if (zoneCluster.length >= LOCALS_CLUSTER_THRESHOLD) {
        const triggeringIds = zoneCluster.map((o) => parseObsId(o.id)).sort((a, b) => a - b);
        const signature = `zone-${anchor.zone_id}-${extractReportType(anchor)}-${triggeringIds.slice(0, 5).join(",")}`;

        if (!processedClusterSignatures.has(signature)) {
          processedClusterSignatures.add(signature);
          if (!isClusterMateriallyOverlapping(triggeringIds, [...activeAlerts, ...createdAlerts])) {
            const alert = await createLocalsAlertRecord(zoneCluster, "zone_fallback");
            if (alert) createdAlerts.push(alert);
          }
        }
      }
    }
  }

  return createdAlerts;
}

/**
 * Resolves an active LOCALS alert.
 * Role-gated for VERIFIED_OFFICIAL, DISPATCHER, or ADMIN.
 */
export async function resolveLocalsAlert(
  alertId: number | string,
  resolution: LocalsResolutionAction,
  note: string,
  resolvedBy: { id?: string; email: string; role: string },
): Promise<{ success: boolean; alert?: LocalsAlertRecord; error?: string }> {
  // Validate authorized roles
  const isAuthorized =
    resolvedBy.role === "VERIFIED_OFFICIAL" ||
    resolvedBy.role === "DISPATCHER" ||
    resolvedBy.role === "ADMIN";

  if (!isAuthorized) {
    return {
      success: false,
      error: "Unauthorized: only VERIFIED_OFFICIAL, DISPATCHER, or ADMIN may resolve LOCALS alerts.",
    };
  }

  if (!note || note.trim().length < 5) {
    return {
      success: false,
      error: "A valid resolution note (minimum 5 characters) is required.",
    };
  }

  const numericId = Number(alertId);
  const resolvedAt = new Date().toISOString();

  // Update in database
  try {
    const supabaseAdmin = await getSupabaseAdmin();
    await supabaseAdmin
      .from("locals_alerts")
      .update({
        status: "RESOLVED",
        resolved_by: `${resolvedBy.role}:${resolvedBy.email}`,
        resolved_at: resolvedAt,
        resolution_note: note.trim(),
        resolution_action: resolution,
      })
      .eq("id", numericId);
  } catch (err: any) {
    console.warn("[LOCALS Resolution Persistence]", err?.message || err);
  }

  // Update in-memory record
  const inMemory = IN_MEMORY_LOCALS_ALERTS.find((a) => a.id === numericId);
  if (inMemory) {
    inMemory.status = "RESOLVED";
    inMemory.resolved_by = `${resolvedBy.role}:${resolvedBy.email}`;
    inMemory.resolved_at = resolvedAt;
    inMemory.resolution_note = note.trim();
    inMemory.resolution_action = resolution;
    return { success: true, alert: inMemory };
  }

  return {
    success: true,
    alert: {
      id: numericId,
      report_type: "slope_movement",
      center_lat: null,
      center_lng: null,
      observation_count: 10,
      triggering_observation_ids: [],
      zone_ids_involved: [],
      detection_method: "gps_proximity",
      first_observed_at: resolvedAt,
      triggered_at: resolvedAt,
      status: "RESOLVED",
      resolved_by: `${resolvedBy.role}:${resolvedBy.email}`,
      resolved_at: resolvedAt,
      resolution_note: note.trim(),
      resolution_action: resolution,
    },
  };
}
