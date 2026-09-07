import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getQueuedObservations,
  getSyncedObservations,
  useOfflineQueue,
  useOnlineStatus,
  syncOfflineObservations,
  clearOfflineQueue,
} from "@/lib/offline-manager";
import type { FieldObservationInput } from "@/lib/sync.service";
import { FieldObservationDialog } from "@/components/FieldObservationDialog";
import { getAllZones } from "@/lib/geography";
import {
  getLocalizedZoneName,
  getLocalizedDistrict,
  getLocalizedState,
} from "@/lib/geo-translations";
import { getOfflineMedia } from "@/lib/offline-media-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FilePlus,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  MapPin,
  Calendar,
  Layers,
  Image as ImageIcon,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";
import { PanelSkeleton, RouteError } from "@/components/ConsoleShell";

export const Route = createFileRoute("/observations")({
  loader: () => ({ ok: true }),
  head: () => ({
    meta: [
      { title: "LandAlert-Nexus — Field Observations & Ground Truth" },
      {
        name: "description",
        content:
          "Official landslide field observations, ground truth reporting, and offline synchronization for disaster management authorities in North East India.",
      },
    ],
  }),
  component: ObservationsPage,
  pendingComponent: () => <PanelSkeleton label="Loading observations console…" />,
  errorComponent: ({ error, reset }) => <RouteError error={error} reset={reset} />,
});

export function ObservationsPage() {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const { queueCount, syncing, syncStatus, triggerSync } = useOfflineQueue();

  const [queuedItems, setQueuedItems] = useState<FieldObservationInput[]>([]);
  const [syncedItems, setSyncedItems] = useState<FieldObservationInput[]>([]);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING_SYNC" | "SYNCED" | "FAILED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>("ALL");
  const [mediaPreviews, setMediaPreviews] = useState<Record<string, string>>({});
  const [syncNotice, setSyncNotice] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const zones = useMemo(() => getAllZones(), []);
  const zoneMap = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  const reloadData = useCallback(() => {
    const queued = getQueuedObservations();
    const synced = getSyncedObservations();
    setQueuedItems(queued);
    setSyncedItems(synced);

    // Resolve offline media items from IndexedDB
    queued.forEach((obs) => {
      if (obs.media_metadata && Array.isArray(obs.media_metadata)) {
        obs.media_metadata.forEach(async (meta: any) => {
          const mediaId = meta.id || meta.url;
          if (mediaId && mediaId.startsWith("offline_")) {
            const stored = await getOfflineMedia(mediaId);
            if (stored && stored.blob) {
              const url = URL.createObjectURL(stored.blob);
              setMediaPreviews((prev) => ({ ...prev, [mediaId]: url }));
            }
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    reloadData();
    if (typeof window === "undefined") return;
    window.addEventListener("landalert-queue-updated", reloadData);
    window.addEventListener("storage", reloadData);
    return () => {
      window.removeEventListener("landalert-queue-updated", reloadData);
      window.removeEventListener("storage", reloadData);
    };
  }, [reloadData]);

  const handleManualSync = async () => {
    if (!isOnline) {
      setSyncNotice({
        type: "error",
        text: t("offline.device_offline_notice", "Device is offline. Connect to network to synchronize pending queue."),
      });
      setTimeout(() => setSyncNotice(null), 4000);
      return;
    }

    setSyncNotice({
      type: "info",
      text: t("offline.syncing", "Synchronizing pending observations with server…"),
    });

    try {
      const res = await triggerSync();
      if (res && res.success) {
        setSyncNotice({
          type: "success",
          text: t("offline.sync_success", "Synchronized {{count}} observation(s) with central early warning engine.", {
            count: res.syncedCount,
          }),
        });
        reloadData();
      } else if (res && res.errors && res.errors.length > 0) {
        setSyncNotice({
          type: "error",
          text: res.errors[0] || t("offline.sync_failed", "Sync failed."),
        });
      }
      setTimeout(() => setSyncNotice(null), 5000);
    } catch (err: any) {
      setSyncNotice({
        type: "error",
        text: err?.message || t("offline.sync_failed", "Sync failed."),
      });
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const handleClearSyncedHistory = () => {
    if (typeof window !== "undefined" && window.confirm(t("sync_queue.confirm_clear_synced", "Clear synchronized history?"))) {
      try {
        localStorage.removeItem("landalert_synced_observations_v1");
        reloadData();
      } catch {}
    }
  };

  // Combine observations with explicit synchronization state
  const allObservations = useMemo(() => {
    const list: Array<FieldObservationInput & { isLocalQueued: boolean }> = [
      ...queuedItems.map((item) => ({
        ...item,
        isLocalQueued: true,
        queue_status: item.queue_status || "PENDING_SYNC",
      })),
      ...syncedItems.map((item) => ({
        ...item,
        isLocalQueued: false,
        queue_status: "SYNCED" as const,
      })),
    ];

    return list.filter((obs) => {
      if (filterStatus === "PENDING_SYNC" && obs.queue_status !== "PENDING_SYNC") return false;
      if (filterStatus === "SYNCED" && obs.queue_status !== "SYNCED") return false;
      if (filterStatus === "FAILED" && obs.queue_status !== "FAILED") return false;

      if (selectedZoneFilter !== "ALL" && String(obs.zone_id) !== selectedZoneFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const zone = zoneMap.get(obs.zone_id);
        const matchZone = zone?.name.toLowerCase().includes(q) || zone?.district.toLowerCase().includes(q);
        const matchObserver = obs.observer_id?.toLowerCase().includes(q);
        const matchSigns = obs.visual_signs?.toLowerCase().includes(q);
        const matchRoad = obs.road_status?.toLowerCase().includes(q);
        const matchKey = obs.idempotency_key?.toLowerCase().includes(q);
        return matchZone || matchObserver || matchSigns || matchRoad || matchKey;
      }
      return true;
    });
  }, [queuedItems, syncedItems, filterStatus, selectedZoneFilter, searchQuery, zoneMap]);

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8 space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("nav.observations", "Field Observations & Ground Truth")}
            </h1>
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono font-semibold text-primary">
              NER-15
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm max-w-3xl">
            {t(
              "observations.subtitle",
              "Ground-truth observations, slope instability monitoring, and resilient offline synchronization across the 15 monitored hill stations in North East India.",
            )}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <FieldObservationDialog
            trigger={
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs uppercase tracking-wider font-semibold shadow-xs cursor-pointer"
              >
                <FilePlus className="h-3.5 w-3.5 mr-1.5" />
                + {t("field_observation.button_label", "Report Observation")}
              </Button>
            }
            onSuccess={reloadData}
          />

          <Button
            size="sm"
            variant="outline"
            onClick={handleManualSync}
            disabled={syncing || queuedItems.length === 0}
            className="font-mono text-xs uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing
              ? t("offline.syncing", "Syncing…")
              : t("offline.sync_now_count", "Sync All ({{count}})", { count: queuedItems.length })}
          </Button>
        </div>
      </div>

      {/* Sync / Action Notice Alert */}
      {syncNotice && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded border p-3 text-xs font-mono leading-relaxed ${
            syncNotice.type === "success"
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
              : syncNotice.type === "error"
              ? "border-red-500/50 bg-red-500/10 text-red-400"
              : "border-blue-500/50 bg-blue-500/10 text-blue-400"
          }`}
        >
          {syncNotice.text}
        </div>
      )}

      {/* Connectivity & Synchronization Lifecycle Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Network State */}
        <div className="rounded border border-border bg-surface p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-mono uppercase text-muted-foreground">
              {t("sync_queue.network_status", "Network Connectivity")}
            </span>
            {isOnline ? (
              <Wifi className="h-4 w-4 text-emerald-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-amber-400 animate-pulse" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`font-mono text-base font-bold ${
                isOnline ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <span className="text-[0.65rem] text-muted-foreground font-mono">
              {isOnline ? "Server API Available" : "Local Storage Active"}
            </span>
          </div>
        </div>

        {/* Pending Sync */}
        <div className="rounded border border-border bg-surface p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-mono uppercase text-muted-foreground">
              {t("sync_queue.pending_label", "Pending Sync")}
            </span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-amber-400">
              {queuedItems.length}
            </span>
            <span className="text-[0.65rem] text-muted-foreground font-mono">
              {queuedItems.length === 1 ? "record queued" : "records queued"}
            </span>
          </div>
        </div>

        {/* Synced Records */}
        <div className="rounded border border-border bg-surface p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-mono uppercase text-muted-foreground">
              {t("sync_queue.synced_label", "Server Synced")}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400">
              {syncedItems.length}
            </span>
            <span className="text-[0.65rem] text-muted-foreground font-mono">
              authoritative records
            </span>
          </div>
        </div>

        {/* Monitored Hill Stations */}
        <div className="rounded border border-border bg-surface p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-mono uppercase text-muted-foreground">
              {t("observations.monitored_zones", "Hill Stations")}
            </span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-foreground">15</span>
            <span className="text-[0.65rem] text-muted-foreground font-mono">
              8 NER States Covered
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="rounded border border-border bg-surface p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setFilterStatus("ALL")}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              filterStatus === "ALL"
                ? "bg-primary text-primary-foreground border-primary font-bold"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({queuedItems.length + syncedItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("PENDING_SYNC")}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              filterStatus === "PENDING_SYNC"
                ? "bg-amber-500/20 text-amber-300 border-amber-500 font-bold"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Sync ({queuedItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("SYNCED")}
            className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              filterStatus === "SYNCED"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Synced ({syncedItems.length})
          </button>
        </div>

        {/* Zone Selector & Search Input */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedZoneFilter}
            onChange={(e) => setSelectedZoneFilter(e.target.value)}
            className="h-8 rounded border border-border bg-secondary/40 px-2 text-xs font-mono text-foreground focus:outline-none"
          >
            <option value="ALL">All 15 Hill Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={String(z.id)}>
                Zone {z.id}: {z.name} ({z.district})
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("observations.search_placeholder", "Filter observations…")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 sm:w-64 pl-7 text-xs font-mono bg-secondary/40 border-border"
            />
          </div>

          {syncedItems.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSyncedHistory}
              title="Clear synced cache"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Observations Grid / List */}
      {allObservations.length === 0 ? (
        <div className="rounded border border-dashed border-border bg-surface/50 p-10 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-display text-base font-bold text-foreground">
            {t("observations.no_records_title", "No observations found")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {filterStatus === "PENDING_SYNC"
              ? t(
                  "observations.no_pending_desc",
                  "No observations currently awaiting synchronization. All records have been persisted to central database.",
                )
              : t(
                  "observations.no_records_desc",
                  "Record ground-truth rainfall, slope cracks, or road blockages in the field. All entries are preserved offline.",
                )}
          </p>
          <div className="mt-4">
            <FieldObservationDialog
              trigger={
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs uppercase"
                >
                  + {t("field_observation.button_label", "Report Observation")}
                </Button>
              }
              onSuccess={reloadData}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allObservations.map((obs) => {
            const zone = zoneMap.get(obs.zone_id);
            const isPending = obs.queue_status === "PENDING_SYNC" || obs.isLocalQueued;
            const isFailed = obs.queue_status === "FAILED";
            const isSynced = obs.queue_status === "SYNCED" && !obs.isLocalQueued;

            return (
              <div
                key={obs.idempotency_key || `${obs.zone_id}-${obs.observed_at}`}
                className={`rounded border p-4 flex flex-col justify-between transition-all bg-surface ${
                  isPending
                    ? "border-amber-500/40 shadow-xs ring-1 ring-amber-500/20"
                    : isFailed
                    ? "border-red-500/40 ring-1 ring-red-500/20"
                    : "border-border hover:border-border/80"
                }`}
              >
                <div className="space-y-3">
                  {/* Status Badge & Zone Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-display font-bold text-sm text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>
                          Zone {obs.zone_id}: {zone?.name || `Station ${obs.zone_id}`}
                        </span>
                      </div>
                      <p className="text-[0.68rem] text-muted-foreground font-mono">
                        {zone?.district || obs.district || "NER"}, {zone?.state || obs.state || "India"}
                      </p>
                    </div>

                    {/* Synchronization Lifecycle Badge */}
                    <div className="shrink-0">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.65rem] font-bold font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                          <Clock className="h-3 w-3" />
                          PENDING SYNC
                        </span>
                      ) : isFailed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.65rem] font-bold font-mono uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                          <AlertTriangle className="h-3 w-3" />
                          SYNC FAILED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.65rem] font-bold font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="h-3 w-3" />
                          SYNCED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Measurements & Ground Signs Grid */}
                  {(() => {
                    const rawSigns = obs.visual_signs || "";
                    let displaySigns = rawSigns;
                    let displayNotes = (obs as any)?.notes || (obs as any)?.description || "";
                    if (rawSigns.includes(" — ")) {
                      const parts = rawSigns.split(" — ");
                      displaySigns = parts[0]?.trim() || rawSigns;
                      const tailNote = parts.slice(1).join(" — ").trim();
                      if (!displayNotes && tailNote) {
                        displayNotes = tailNote;
                      }
                    }

                    return (
                      <>
                        <div className="grid grid-cols-2 gap-2 rounded bg-secondary/30 p-2.5 text-xs font-mono">
                          <div>
                            <span className="block text-[0.65rem] uppercase text-muted-foreground">
                              Rainfall (24h)
                            </span>
                            <span className="font-semibold text-foreground">
                              {obs.rainfall_mm !== undefined && obs.rainfall_mm !== null
                                ? `${obs.rainfall_mm} mm`
                                : "None reported"}
                            </span>
                          </div>

                          <div>
                            <span className="block text-[0.65rem] uppercase text-muted-foreground">
                              Soil Condition
                            </span>
                            <span className="font-semibold text-foreground capitalize">
                              {obs.soil_condition || "damp"}
                            </span>
                          </div>

                          <div>
                            <span className="block text-[0.65rem] uppercase text-muted-foreground">
                              Slope Signs
                            </span>
                            <span className="font-semibold text-foreground truncate block" title={displaySigns || "None"}>
                              {displaySigns || "None"}
                            </span>
                          </div>

                          <div>
                            <span className="block text-[0.65rem] uppercase text-muted-foreground">
                              Road Status
                            </span>
                            <span
                              className={`font-semibold uppercase ${
                                obs.road_status === "blocked"
                                  ? "text-red-400"
                                  : obs.road_status === "restricted"
                                  ? "text-amber-400"
                                  : "text-foreground"
                              }`}
                            >
                              {obs.road_status || "open"}
                            </span>
                          </div>
                        </div>

                        {displayNotes && (
                          <div className="p-2.5 rounded bg-secondary/30 border border-border/70 text-xs">
                            <span className="text-[0.65rem] font-mono text-primary uppercase block mb-1">
                              💬 Field Description & Translated Message:
                            </span>
                            <p className="font-medium text-foreground whitespace-pre-wrap">{displayNotes}</p>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Attached Media Photos */}
                  {obs.media_metadata && obs.media_metadata.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Media Evidence ({obs.media_metadata.length})
                        </span>
                        {isPending && (
                          <span className="text-amber-400 text-[0.62rem]">
                            Stored in local IndexedDB
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {obs.media_metadata.map((meta: any, idx: number) => {
                          const mediaId = meta.id || meta.url;
                          const previewSrc = mediaPreviews[mediaId] || meta.url || meta.storagePath;

                          return (
                            <div
                              key={idx}
                              className="relative h-14 w-14 shrink-0 rounded border border-border bg-secondary/50 overflow-hidden flex items-center justify-center text-[0.6rem] text-muted-foreground font-mono"
                            >
                              {previewSrc ? (
                                <img
                                  src={previewSrc}
                                  alt={meta.name || "Evidence"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span>{meta.name?.slice(0, 5) || "Media"}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Coordinates & Location Metadata */}
                  {obs.geo_lat !== undefined && obs.geo_lat !== null && (
                    <div className="flex items-center gap-1 text-[0.68rem] font-mono text-muted-foreground">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span>
                        GPS: {obs.geo_lat.toFixed(4)}°, {obs.geo_lng?.toFixed(4)}°
                        {obs.geo_accuracy_m ? ` (±${Math.round(obs.geo_accuracy_m)}m)` : ""}
                      </span>
                    </div>
                  )}

                  {/* Error if failed */}
                  {obs.last_error && (
                    <div className="rounded border border-red-500/30 bg-red-500/10 p-2 text-[0.68rem] text-red-400 font-mono">
                      Error: {obs.last_error}
                    </div>
                  )}
                </div>

                {/* Footer Metadata: Client ID, Observed At, Synced At */}
                <div className="mt-4 pt-3 border-t border-border/60 text-[0.65rem] font-mono text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[200px]" title={obs.idempotency_key}>
                      ID: {obs.idempotency_key}
                    </span>
                    <span className="font-semibold text-foreground">
                      {obs.observer_id || "citizen_observer"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[0.62rem]">
                    <span>
                      Observed: {new Date(obs.observed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {obs.synced_at ? (
                      <span className="text-emerald-400">
                        Synced: {new Date(obs.synced_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    ) : (
                      <span className="text-amber-400">Awaiting reconnection</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
