import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2, XCircle, MapPin, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LocalsAlertRecord } from "@/lib/locals-escalation.service";
import type { ZoneRow } from "@/lib/monitoring.functions";

interface Props {
  zones?: ZoneRow[];
  viewerRole?: string | null;
  accessToken?: string | null;
  onSelectZone?: (zoneId: number) => void;
  onOpenObservations?: () => void;
}

export function LocalsAlertsPanel({
  zones = [],
  viewerRole,
  accessToken,
  onSelectZone,
  onOpenObservations,
}: Props) {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<LocalsAlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<LocalsAlertRecord | null>(null);
  const [resolveAction, setResolveAction] = useState<"CONFIRMED_HAZARD" | "FALSE_PATTERN">("CONFIRMED_HAZARD");
  const [resolveNote, setResolveNote] = useState("");
  const [dispatchAlert, setDispatchAlert] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const canResolve =
    viewerRole === "VERIFIED_OFFICIAL" ||
    viewerRole === "DISPATCHER" ||
    viewerRole === "ADMIN";

  async function fetchActiveAlerts() {
    try {
      const res = await fetch("/api/locals/active");
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.alerts)) {
          setAlerts(json.alerts);
        }
      }
    } catch {
      // Offline or network error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActiveAlerts();
    const interval = setInterval(fetchActiveAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleResolveSubmit() {
    if (!selectedAlert || resolveNote.trim().length < 5) return;
    setSubmitting(true);
    setNotice(null);

    try {
      const res = await fetch(`/api/locals/${selectedAlert.id}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          resolution: resolveAction,
          note: resolveNote.trim(),
          dispatch_alert: resolveAction === "CONFIRMED_HAZARD" && dispatchAlert,
          zone_id: selectedAlert.zone_ids_involved[0],
        }),
      });

      if (res.ok) {
        setNotice({
          type: "success",
          text: t(
            "locals.resolved_success",
            "LOCALS pattern resolved. Audit record logged.",
          ),
        });
        setTimeout(() => {
          setSelectedAlert(null);
          setResolveNote("");
          fetchActiveAlerts();
        }, 1200);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setNotice({
          type: "error",
          text: errJson.error || t("locals.resolve_failed", "Failed to resolve alert"),
        });
      }
    } catch (err: any) {
      setNotice({
        type: "error",
        text: err?.message || t("locals.network_error", "Network error occurred"),
      });
    } finally {
      setSubmitting(false);
    }
  }

  function getZoneNames(zoneIds: number[]): string {
    if (!zoneIds || zoneIds.length === 0) return t("locals.unknown_location", "Regional Hill Sector");
    const names = zoneIds
      .map((zid) => zones.find((z) => z.id === zid)?.zone_name || `Zone ${zid}`)
      .slice(0, 2);
    return names.join(", ");
  }

  function formatReportType(type: string): string {
    switch (type) {
      case "crack":
        return t("locals.type_crack", "Tension Cracks on Slope");
      case "slope_movement":
        return t("locals.type_slope_movement", "Slope Movement / Mudflow");
      case "road_blocked":
        return t("locals.type_road_blocked", "Road Blocked / Impassable");
      default:
        return t("locals.type_other", "Emerging Ground Hazard");
    }
  }

  if (!loading && alerts.length === 0) {
    return null; // Keep dashboard uncluttered when no active clusters exist
  }

  return (
    <section className="space-y-3" aria-label="LOCALS Community Pattern Alerts">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-amber-700 dark:text-amber-300">
                {t("locals.panel_title", "LOCALS Auto-Escalation Signals")}
              </h2>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-amber-700 dark:text-amber-300">
                {alerts.length} {alerts.length === 1 ? t("locals.pattern", "Pattern") : t("locals.patterns", "Patterns")}
              </span>
            </div>
            <p className="text-[0.72rem] text-muted-foreground">
              {t(
                "locals.disclaimer",
                "Community-Reported Pattern — Pending Official Verification (10+ matching citizen reports in ≤1 hour)",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {alerts.map((alert) => {
          const isGps = alert.detection_method === "gps_proximity";
          const areaLabel = getZoneNames(alert.zone_ids_involved);

          return (
            <div
              key={alert.id}
              className="rounded-lg border-2 border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20 p-4 space-y-3 shadow-xs transition-all hover:border-amber-500/60"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[0.65rem] font-mono font-semibold ${
                        isGps
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      {isGps
                        ? t("locals.tag_gps", "Precise: 500m GPS cluster")
                        : t("locals.tag_zone", "Approximate: zone-wide (GPS unavailable)")}
                    </span>
                    <span className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
                      {alert.observation_count} {t("locals.reports", "reports")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-display text-foreground">
                    {formatReportType(alert.report_type)}
                  </h3>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[0.72rem] text-muted-foreground font-mono bg-background/60 dark:bg-background/40 p-2.5 rounded border border-border/50">
                <div>
                  <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground/70 block">
                    {t("locals.location_label", "Area / Zones")}
                  </span>
                  <span className="font-semibold text-foreground truncate block" title={areaLabel}>
                    {areaLabel}
                  </span>
                </div>
                <div>
                  <span className="text-[0.62rem] uppercase tracking-wider text-muted-foreground/70 block">
                    {t("locals.timespan_label", "First Observed")}
                  </span>
                  <span className="text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 inline text-muted-foreground" />
                    {new Date(alert.first_observed_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectZone && alert.zone_ids_involved[0]) {
                      onSelectZone(alert.zone_ids_involved[0]);
                    }
                    if (onOpenObservations) {
                      onOpenObservations();
                    }
                  }}
                  className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  {t("locals.view_underlying_obs", "View Underlying Reports →")}
                </button>

                {canResolve && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAlert(alert);
                      setResolveAction("CONFIRMED_HAZARD");
                      setResolveNote("");
                      setNotice(null);
                    }}
                    className="h-7 border-amber-500/50 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 text-xs font-mono"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                    {t("locals.resolve_button", "Review / Resolve")}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution Dialog for Authorized Officials */}
      <Dialog open={selectedAlert !== null} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <DialogContent className="max-w-md bg-surface border-border z-[200]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              {t("locals.resolve_modal_title", "Resolve LOCALS Pattern Alert")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t(
                "locals.resolve_modal_desc",
                "Official determination for this community-reported cluster. Logged in the immutable audit log.",
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-3.5 py-2">
              <div className="rounded border border-border bg-secondary/30 p-2.5 text-xs font-mono space-y-1">
                <div>
                  <span className="text-muted-foreground">{t("locals.type_heading", "Hazard")}:</span>{" "}
                  <span className="font-semibold text-foreground">{formatReportType(selectedAlert.report_type)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("locals.cluster_heading", "Cluster Size")}:</span>{" "}
                  <span className="font-semibold text-foreground">{selectedAlert.observation_count} observations</span> (
                  {selectedAlert.detection_method})
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono uppercase text-muted-foreground">
                  {t("locals.action_heading", "Determination")}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolveAction("CONFIRMED_HAZARD")}
                    className={`p-2.5 rounded border text-left text-xs font-mono flex items-center gap-2 cursor-pointer transition-all ${
                      resolveAction === "CONFIRMED_HAZARD"
                        ? "border-destructive bg-destructive/10 text-destructive font-bold"
                        : "border-border bg-secondary/20 text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{t("locals.action_confirmed", "Confirmed Hazard")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolveAction("FALSE_PATTERN")}
                    className={`p-2.5 rounded border text-left text-xs font-mono flex items-center gap-2 cursor-pointer transition-all ${
                      resolveAction === "FALSE_PATTERN"
                        ? "border-muted-foreground bg-secondary/50 text-foreground font-bold"
                        : "border-border bg-secondary/20 text-muted-foreground"
                    }`}
                  >
                    <XCircle className="h-4 w-4 shrink-0" />
                    <span>{t("locals.action_false", "False Pattern")}</span>
                  </button>
                </div>
              </div>

              {resolveAction === "CONFIRMED_HAZARD" && (
                <div className="flex items-center space-x-2 rounded border border-destructive/30 bg-destructive/10 p-2.5">
                  <input
                    type="checkbox"
                    id="escalateDispatchCheckbox"
                    checked={dispatchAlert}
                    onChange={(e) => setDispatchAlert(e.target.checked)}
                    className="h-4 w-4 accent-destructive cursor-pointer"
                  />
                  <Label htmlFor="escalateDispatchCheckbox" className="text-xs text-foreground cursor-pointer">
                    {t(
                      "locals.escalate_dispatch",
                      "Immediately evaluate & dispatch official emergency alert to field teams",
                    )}
                  </Label>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="resolutionNote" className="text-xs font-mono uppercase text-muted-foreground">
                  {t("locals.notes_heading", "Operational Justification / Reason (min 5 chars)")}
                </Label>
                <Textarea
                  id="resolutionNote"
                  rows={3}
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  placeholder={t(
                    "locals.notes_placeholder",
                    "e.g., GSI field team confirmed tension crack widening on western slope.",
                  )}
                  className="bg-secondary/40 border-border text-xs font-mono"
                />
              </div>

              {notice && (
                <p
                  className={`text-xs font-mono ${
                    notice.type === "success" ? "text-emerald-500" : "text-destructive"
                  }`}
                >
                  {notice.text}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedAlert(null)}
              disabled={submitting}
              className="text-xs font-mono"
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleResolveSubmit}
              disabled={submitting || resolveNote.trim().length < 5}
              className="text-xs font-mono bg-amber-600 hover:bg-amber-700 text-white"
            >
              {submitting ? t("common.submitting", "Saving…") : t("locals.confirm_resolve", "Confirm Resolution")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
