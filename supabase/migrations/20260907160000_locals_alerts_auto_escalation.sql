-- ==============================================================================
-- LOCALS (Localized Observation Cluster & Automated Logistical Signal) Migration
-- Adds locals_alerts table and formal report_type column on field_observations
-- ==============================================================================

-- 1. Ensure report_type column exists on field_observations
ALTER TABLE public.field_observations 
  ADD COLUMN IF NOT EXISTS report_type TEXT 
  CHECK (report_type IS NULL OR report_type IN ('crack', 'slope_movement', 'road_blocked', 'other'));

CREATE INDEX IF NOT EXISTS idx_field_observations_locals_cluster
  ON public.field_observations (observed_at, status, report_type)
  WHERE status = 'PENDING_VERIFICATION' OR status = 'SUBMITTED';

-- 2. Create locals_alerts table
CREATE TABLE IF NOT EXISTS public.locals_alerts (
  id BIGSERIAL PRIMARY KEY,
  report_type TEXT NOT NULL CHECK (report_type IN ('crack', 'slope_movement', 'road_blocked', 'other')),
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  observation_count INTEGER NOT NULL,
  triggering_observation_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  zone_ids_involved INTEGER[] NOT NULL DEFAULT '{}',
  detection_method TEXT NOT NULL CHECK (detection_method IN ('gps_proximity', 'zone_fallback')),
  first_observed_at TIMESTAMPTZ NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED', 'DISMISSED')),
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ,
  resolution_note TEXT,
  resolution_action TEXT CHECK (resolution_action IS NULL OR resolution_action IN ('CONFIRMED_HAZARD', 'FALSE_PATTERN'))
);

-- 3. Indices for query and overlap checking performance
CREATE INDEX IF NOT EXISTS idx_locals_alerts_status_triggered 
  ON public.locals_alerts (status, triggered_at DESC);

CREATE INDEX IF NOT EXISTS idx_locals_alerts_report_type 
  ON public.locals_alerts (report_type, status);

-- 4. Row Level Security Policies
ALTER TABLE public.locals_alerts ENABLE ROW LEVEL SECURITY;

-- Public can view active alerts (community early warning signal)
CREATE POLICY "Public can view active locals alerts"
  ON public.locals_alerts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'ACTIVE');

-- Authenticated officials can view all alerts (active, resolved, dismissed)
CREATE POLICY "Officials can view all locals alerts"
  ON public.locals_alerts
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' ~* '@(gsi\.gov\.in|ndma\.gov\.in|asdma\.gov\.in|sdma\.gov\.in|ddma\.nic\.in|nesac\.gov\.in|admin\.landalert\.org)$'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('VERIFIED_OFFICIAL', 'DISPATCHER', 'ADMIN')
  );

-- Service role can create/update alerts (from automated clustering and cron)
CREATE POLICY "Service role has full access to locals alerts"
  ON public.locals_alerts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Officials can resolve/update locals alerts
CREATE POLICY "Officials can update and resolve locals alerts"
  ON public.locals_alerts
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' ~* '@(gsi\.gov\.in|ndma\.gov\.in|asdma\.gov\.in|sdma\.gov\.in|ddma\.nic\.in|nesac\.gov\.in|admin\.landalert\.org)$'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('VERIFIED_OFFICIAL', 'DISPATCHER', 'ADMIN')
  )
  WITH CHECK (
    auth.jwt() ->> 'email' ~* '@(gsi\.gov\.in|ndma\.gov\.in|asdma\.gov\.in|sdma\.gov\.in|ddma\.nic\.in|nesac\.gov\.in|admin\.landalert\.org)$'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('VERIFIED_OFFICIAL', 'DISPATCHER', 'ADMIN')
  );
