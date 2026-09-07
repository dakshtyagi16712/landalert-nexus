# LandAlert-Nexus: Comprehensive System Workflow & Architectural Diagrams

> **Note:** This document provides the complete, copy-pasteable diagrammatic workflow of LandAlert-Nexus.  
> You can copy these Mermaid code blocks into any Markdown viewer, Mermaid Live Editor ([mermaid.live](https://mermaid.live)), Notion, GitHub, or Mermaid-compatible documentation tool.

---

## 1. Complete Project Workflow (High-Level Overview)

A clear, end-to-end representation of how the entire LandAlert-Nexus platform operates from data ingestion to emergency action:

```mermaid
flowchart LR
    %% High-level styling
    classDef source fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef engine fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef storage fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef portal fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef response fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fff;

    subgraph S1["1. Data Ingestion"]
        A1["🛰️ Satellite Radar & Optical<br/>(Sentinel-1 / Sentinel-2)"]:::source
        A2["🌧️ Weather & Soil Moisture<br/>(Open-Meteo & ERA5)"]:::source
        A3["📱 Ground Field Reports<br/>(Citizen & Officer PWA)"]:::source
    end

    subgraph S2["2. Risk & AI Engine"]
        B1["Radar InSAR Ground Velocity"]:::engine
        B2["Hydrological Rainfall Thresholds"]:::engine
        B3["Machine Learning Hazard Scoring"]:::engine
    end

    subgraph S3["3. Central Database"]
        C1[("Supabase PostgreSQL<br/>• Realtime Risk Status<br/>• Spatial Zones<br/>• Incident Reports")]:::storage
    end

    subgraph S4["4. Web Command Center"]
        D1["Interactive GIS Map"]:::portal
        D2["9 Regional Languages & Offline PWA"]:::portal
        D3["Officer Review & Verification Console"]:::portal
    end

    subgraph S5["5. Emergency Response"]
        E1["🚨 TRAI DLT Emergency SMS Alerts"]:::response
        E2["🚒 NDRF / SDRF Team Dispatch"]:::response
        E3["📢 Public Advisory & Evacuation Warning"]:::response
    end

    %% Data Flow
    A1 --> B1
    A2 --> B2
    B1 & B2 --> B3
    B3 --> C1
    A3 --> C1

    C1 <--> S4
    S4 --> S5
```

---

## 2. Detailed Architectural Component Flowchart

```mermaid
flowchart TD
    %% Subgraphs & Styling
    classDef dataSource fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef processingCore fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef storageLayer fill:#1e1b4b,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef webTier fill:#312e81,stroke:#6366f1,stroke-width:2px,color:#fff;
    classDef clientTier fill:#064e3b,stroke:#14b8a6,stroke-width:2px,color:#fff;
    classDef dispatchTier fill:#450a0a,stroke:#ef4444,stroke-width:2px,color:#fff;

    subgraph INGESTION["1. Telemetry & Data Acquisition Layer"]
        A1["Open-Meteo API<br/>(Live 24h/72h Rain Accumulation)"]:::dataSource
        A2["Open-Meteo ERA5-Land<br/>(0-3cm Soil Moisture Volumetric)"]:::dataSource
        A3["OpenTopoData / SRTM 30m DEM<br/>(3x3 Multi-Point Grid Sampling)"]:::dataSource
        A4["Copernicus CDSE Sentinel-1 SAR<br/>(SLC Products & Precise Orbits)"]:::dataSource
        A5["Copernicus Sentinel-2<br/>(Multispectral True-Color & NDVI)"]:::dataSource
        A6["IMD AWS / ARG & Road Feeds<br/>(Surface Gauges & NH Highways)"]:::dataSource
    end

    subgraph ENGINE["2. Scientific Processing & Intelligence Core"]
        B1["Ingestion Pipeline & Normalizer<br/>(/api/ingest-weather)"]:::processingCore
        B2["Regional Hydrological Threshold Physics<br/>(Monga-Ganguli 2024/2026 + Das 2018)"]:::processingCore
        B3["19-Feature Machine Learning Registry<br/>(v0.2-lr-trained Logistic Regression)"]:::processingCore
        B4["Deterministic Risk Recomputation<br/>(recompute_risk() / PL/pgSQL)"]:::processingCore
        B5["Decoupled InSAR Async Engine<br/>(ISCE2 topsApp + SNAPHU + MintPy)"]:::processingCore
    end

    subgraph STORAGE["3. Supabase High-Availability Data Tier"]
        C1[("PostgreSQL 15+ Engine")]:::storageLayer
        C2["Row-Level Security (RLS) & Auth Policies"]:::storageLayer
        C3["Database Tables:<br/>• risk_zones<br/>• weather_readings<br/>• field_observations<br/>• insar_deformation_products<br/>• risk_model_config"]:::storageLayer
        C4["S3-Compatible Object Storage<br/>(Field Photos & Audio Voice Notes)"]:::storageLayer
    end

    subgraph EDGE["4. Application Edge & Server Layer"]
        D1["Nitro / H3 API Router<br/>(CSRF Guard · Rate Limiter · Input Sanitizer)"]:::webTier
        D2["TanStack Start SSR Shell<br/>(Hydration Engine · Route Pre-loaders)"]:::webTier
        D3["Satellite Tile & Audio Proxy<br/>(24h In-Memory Cache · Quota Shield)"]:::webTier
    end

    subgraph CLIENTS["5. Edge Clients & Operational Field Roles"]
        E1["District Disaster Command Center<br/>(Desktop GIS Dashboard · Leaflet Map · Triage Matrix)"]:::clientTier
        E2["Field Officer Mobile PWA<br/>(Auto-GPS Capture · Offline IndexedDB · Audio Notes)"]:::clientTier
        E3["Citizen Reporting Portal<br/>(9-Language UI · Voice Input · Public Review Queue)"]:::clientTier
    end

    subgraph EMERGENCY["6. Multi-Channel Emergency Response Layer"]
        F1["Algorithmic Response Prioritization<br/>(Severity + Population + Road + Reports)"]:::dispatchTier
        F2["TRAI DLT-Compliant SMS Gateway<br/>(MSG91 Flow API · 4-Language Templates)"]:::dispatchTier
        F3["Field Team Dispatch Console<br/>(NDRF / SDRF Team Assignment & Tracking)"]:::dispatchTier
    end

    %% Flow Connections
    A1 & A2 & A3 & A6 --> B1
    A4 --> B5
    A5 --> D3

    B1 --> C1
    B5 --> C3
    B2 & B3 --> B4
    B4 <--> C1

    C1 & C3 & C4 --> D1
    C2 --> D1
    D1 <--> D2
    D3 <--> D2

    D2 <--> E1
    D2 <--> E2
    D2 <--> E3

    E2 -.->|Offline Sync Queue\nwhen connection restores| D1
    E3 -.->|Public Observation Submission| D1

    E1 --> F1
    F1 --> F2
    F1 --> F3
```

---

## 2. Telemetry Ingestion & Risk Scoring Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Cron as pg_cron / External Trigger
    participant Ingest as /api/ingest-weather (API Router)
    participant OpenMeteo as Open-Meteo / ERA5-Land
    participant DB as Supabase (PostgreSQL)
    participant RiskProc as recompute_risk() (PL/pgSQL)
    participant ML as ML Risk Classifier (v0.2-lr)
    participant UI as Dashboard Clients (SSE / Poll)

    Cron->>Ingest: Trigger Scheduled Ingestion (POST /api/ingest-weather)
    Ingest->>OpenMeteo: Fetch 24h/72h rainfall & 0-3cm soil moisture for 15 NER zones
    OpenMeteo-->>Ingest: Return hourly precipitation + volumetric soil moisture (m³/m³)
    
    Ingest->>Ingest: Normalize soil moisture (0-100% using 0.40 m³/m³ field capacity)
    Ingest->>DB: Upsert into `weather_readings` (idempotent ON CONFLICT)
    
    Ingest->>RiskProc: Execute `SELECT recompute_risk();`
    
    activate RiskProc
    RiskProc->>DB: Query active `risk_model_config` (v0.2-lr-trained weights & thresholds)
    RiskProc->>DB: Compute 72-hr rainfall, 30-day antecedent rain, slope P90, soil moisture
    RiskProc->>RiskProc: Evaluate Regional Equations:
    Note over RiskProc: Sikkim: I = 43.26 × D^(-0.78) (Das et al. 2018)<br/>NER Regional: E = -11.10 + 0.62 × D (Monga & Ganguli 2024/2026)
    RiskProc->>ML: Extract 19 canonical features & compute hazard probability
    ML-->>RiskProc: Return calibrated hazard score [0.0 - 1.0]
    RiskProc->>RiskProc: Generate dynamic plain-language attribution (highest weighted factor)
    RiskProc->>DB: Update `risk_zones` (current_risk_level, risk_score, dominant_factor)
    RiskProc->>DB: Record historical row in `risk_evaluations`
    deactivate RiskProc

    RiskProc-->>Ingest: Return recomputed zone count & summary
    Ingest-->>Cron: HTTP 200 OK
    DB-->>UI: Realtime update triggers / Client queries new risk statuses
```

---

## 3. Satellite Radar (InSAR) Geodetic Processing Workflow

```mermaid
flowchart TD
    classDef startNode fill:#0284c7,stroke:#0369a1,stroke-width:2px,color:#fff;
    classDef workerNode fill:#475569,stroke:#334155,stroke-width:2px,color:#fff;
    classDef decisionNode fill:#b45309,stroke:#78350f,stroke-width:2px,color:#fff;
    classDef dbNode fill:#7c3aed,stroke:#5b21b6,stroke-width:2px,color:#fff;
    classDef termNode fill:#15803d,stroke:#166534,stroke-width:2px,color:#fff;
    classDef errorNode fill:#b91c1c,stroke:#991b1b,stroke-width:2px,color:#fff;

    Start(["Operator / Automated Trigger<br/>POST /api/satellite/jobs"]):::startNode --> Auth{"Validate Auth &<br/>Cell Coordinates"}:::decisionNode
    
    Auth -- Invalid --> Err1["Reject Request (HTTP 400/401)"]:::errorNode
    Auth -- Valid --> Dedup{"Check Existing Pending<br/>Job for Cell & Timeframe"}:::decisionNode
    
    Dedup -- Duplicate Exists --> ReturnDup["Return Existing Job ID (HTTP 200)"]:::workerNode
    Dedup -- New Request --> InsertJob["Insert Job with status='QUEUED'<br/>into satellite_processing_jobs"]:::dbNode
    
    InsertJob --> Return202["Return HTTP 202 Accepted<br/>with Job Metadata & ID"]:::startNode
    
    Return202 -.-> AsyncWorker["Asynchronous InSAR Worker<br/>(Dedicated Container: 16GB+ RAM, GDAL, ISCE2, MintPy)"]:::workerNode
    
    AsyncWorker --> Step1["Step 1: FETCHING_ORBITS<br/>Download Sentinel-1 SLC Pair & POEORB from Copernicus CDSE"]:::workerNode
    Step1 --> Step2["Step 2: CO-REGISTRATION<br/>Geometric alignment of Master & Slave SLC rasters"]:::workerNode
    Step2 --> Step3["Step 3: INTERFEROGRAM<br/>Generate differential interferogram & remove topographic phase (SRTM)"]:::workerNode
    Step3 --> Step4["Step 4: PHASE_UNWRAPPING<br/>Execute SNAPHU 2D statistical-cost network flow algorithm"]:::workerNode
    Step4 --> Step5["Step 5: GEOCODING<br/>Convert radar Doppler coordinates to WGS84 Lat/Lng GeoTIFF"]:::workerNode
    
    Step5 --> QC{"Quality Control Check<br/>1. Coherence ≥ 0.40?<br/>2. Valid Pixels ≥ 20%?"}:::decisionNode
    
    QC -- Failed (Dense Jungle / Water) --> LowCoherence["Flag as UNAVAILABLE<br/>reason: SAR_DECORRELATION_DENSE_CANOPY"]:::errorNode
    QC -- Passed --> CalcDisp["Step 6: DISPLACEMENT<br/>Calculate Line-of-Sight (LOS) velocity (mm/year)<br/>and cumulative deformation (mm)"]:::termNode
    
    LowCoherence --> WriteDB["Update satellite_processing_jobs status='FAILED' / 'UNAVAILABLE'"]:::dbNode
    CalcDisp --> WriteProd["Write product to insar_deformation_products<br/>& append to insar_displacement_timeseries"]:::dbNode
    
    WriteProd --> CompleteJob["Update satellite_processing_jobs status='COMPLETED'"]:::dbNode
    CompleteJob --> ClientPoll["Dashboard /api/satellite/deformation<br/>displays verified LOS ground deformation"]:::termNode
```

---

## 4. Resilient Offline-First Field Reporting & Voice Intelligence Workflow

```mermaid
flowchart TD
    classDef clientStep fill:#0f766e,stroke:#115e59,stroke-width:2px,color:#fff;
    classDef condition fill:#d97706,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef offlineStep fill:#4338ca,stroke:#3730a3,stroke-width:2px,color:#fff;
    classDef syncStep fill:#059669,stroke:#047857,stroke-width:2px,color:#fff;

    Start(["Field Observer Opens PWA"]):::clientStep --> GeoInit["Background Geolocation Activation<br/>(navigator.geolocation.watchPosition)"]:::clientStep
    
    GeoInit --> GeoStore["Persist coordinates in SessionStorage & IndexedDB<br/>(Accuracy, Timestamp, Lat/Lng)"]:::clientStep
    
    GeoStore --> OpenReport["Observer Clicks 'Report Landslide'"]:::clientStep
    
    OpenReport --> AutoPopulate["Zero-Click Form Population:<br/>1. Lat & Lng set from GPS<br/>2. Reverse spatial match finds State, District & Zone ID<br/>3. Observation time auto-stamped"]:::clientStep
    
    AutoPopulate --> InputChoice{"Select Input Method"}:::condition
    
    %% Typing branch
    InputChoice -- Text Typing --> LangText["Type observation in any of 9 languages"]:::clientStep
    
    %% Voice branch
    InputChoice -- Voice Input --> MicClick["Click Microphone Button"]:::clientStep
    MicClick --> MediaRec["Start MediaRecorder (Audio Blob capture)"]:::clientStep
    
    MediaRec --> NetCheckSpeech{"Internet Available<br/>for Speech API?"}:::condition
    NetCheckSpeech -- Yes (Online) --> LiveSpeech["Web Speech Recognition API<br/>Real-time speech-to-text transcript"]:::clientStep
    LiveSpeech --> TransServ["Translate regional text to English<br/>via translation.service.ts"]:::clientStep
    
    NetCheckSpeech -- No (Offline) --> FallbackAudio["Store Audio Blob locally in IndexedDB<br/>Append '[🎙️ Voice note (Xs)]' to description"]:::offlineStep
    
    LangText & TransServ & FallbackAudio --> AttachMedia["Attach Ground Photos / Damage Video (Optional)"]:::clientStep
    
    AttachMedia --> SubmitClick["Observer Clicks 'Submit Observation'"]:::clientStep
    
    SubmitClick --> NetCheckSubmit{"Network Status?"}:::condition
    
    %% Online Submit
    NetCheckSubmit -- Online --> DirectPost["POST /api/observations/create<br/>Upload media to Supabase Bucket<br/>Insert record to field_observations"]:::syncStep
    DirectPost --> SuccessToast["Display Success Confirmation<br/>Record live on community board"]:::syncStep
    
    %% Offline Submit
    NetCheckSubmit -- Offline --> LocalQueue["Save to IndexedDB 'pending_observations'<br/>Save media Blob to 'offline_media_blobs'"]:::offlineStep
    LocalQueue --> OfflineBanner["Display 'Stored Offline' Badge<br/>PWA background sync listener registered"]:::offlineStep
    
    OfflineBanner --> WaitConn{"Device Reconnects<br/>to Cellular / Wi-Fi?"}:::condition
    WaitConn -- Network Detected --> SyncEngine["Background Sync Engine (useSyncQueue.ts):<br/>1. Dequeue pending records<br/>2. Upload binary blobs to Supabase Storage<br/>3. Send POST /api/observations/create<br/>4. Remove processed items from IndexedDB"]:::syncStep
    SyncEngine --> SuccessToast
```

---

## 5. Emergency Incident Triage, Decision Support & SMS Alert Dispatch Workflow

```mermaid
flowchart TD
    classDef trigger fill:#991b1b,stroke:#7f1d1d,stroke-width:2px,color:#fff;
    classDef triage fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef decision fill:#854d0e,stroke:#713f12,stroke-width:2px,color:#fff;
    classDef dispatch fill:#065f46,stroke:#064e3b,stroke-width:2px,color:#fff;
    classDef audit fill:#581c87,stroke:#3b0764,stroke-width:2px,color:#fff;

    AlertTrigger(["Risk Threshold Exceeded or<br/>Critical Sensor Ingestion"]):::trigger --> EvalEngine["Prioritization Triage Engine<br/>(/src/lib/prioritization.service.ts)"]:::triage
    
    EvalEngine --> CalcMetric["Calculate Multi-Factor Priority Score:<br/>S = 0.40×C_severity + 0.25×C_population + 0.20×C_road + 0.15×C_observations"]:::triage
    
    CalcMetric --> TelemetryCheck{"Is Zone Telemetry Intact?<br/>(severityRank !== null)"}:::decision
    
    TelemetryCheck -- Degraded / Lost Telemetry --> DegradedTier["Assign to UNRANKED INVESTIGATION TIER<br/>(Flagged for immediate manual comms verification)"]:::trigger
    TelemetryCheck -- Valid Telemetry --> RankZone["Assign Numeric Rank & Severity Level:<br/>CRITICAL / HIGH / ELEVATED / LOW"]:::triage
    
    RankZone --> AlertConsole["Render Alert on Incident Command Console<br/>(/alerts - Protected Route)"]:::triage
    
    AlertConsole --> OfficerAction{"Incident Commander Review"}:::decision
    
    OfficerAction -- Retract / False Alarm --> RetractFlow["Mark alert retracted with documented reason<br/>Audit log committed to emergency_alerts"]:::audit
    
    OfficerAction -- Approve Emergency Broadcast --> DispatchSelect["Select Target Zone & Languages<br/>(English, Assamese, Bengali, Nepali)"]:::dispatchTier
    
    DispatchSelect --> DLTPrep["Prepare Pre-Registered TRAI DLT Templates<br/>Fill dynamic variables: {#var#}=Zone, {#var#}=Risk"]:::dispatchTier
    
    DLTPrep --> KeyCheck{"Is MSG91_AUTH_KEY Configured<br/>& SMS_ENABLED=true?"}:::decision
    
    KeyCheck -- Unconfigured / Sandbox --> SandboxMode["Log simulated dispatch (SMS_SANDBOX_MODE)<br/>Status marked 'provider_unconfigured'<br/>Zero false positive logs"]:::audit
    
    KeyCheck -- Production Active --> CallGateway["Call MSG91 Flow API (POST https://control.msg91.com/api/v5/flow/)<br/>Bearer Authentication + Entity PE_ID"]:::dispatchTier
    
    CallGateway --> CarrierDeliver["Indian Telecom Network Delivery<br/>(Jio, Airtel, Vi, BSNL subscribers in zone)"]:::dispatchTier
    
    CarrierDeliver --> RecordAudit["Update alert status='DISPATCHED'<br/>Store delivery timestamp & provider message ID"]:::audit
```

---

## 6. Full Data Security & Row-Level Security (RLS) Model

```mermaid
flowchart LR
    classDef user fill:#0369a1,stroke:#075985,stroke-width:2px,color:#fff;
    classDef auth fill:#4338ca,stroke:#3730a3,stroke-width:2px,color:#fff;
    classDef rls fill:#0f766e,stroke:#115e59,stroke-width:2px,color:#fff;
    classDef data fill:#1e1b4b,stroke:#2e1065,stroke-width:2px,color:#fff;

    subgraph USERS["User Personas"]
        U1["Anonymous Public Visitor"]:::user
        U2["Authenticated Citizen Reporter"]:::user
        U3["Authorized Disaster Official (Role: official/admin)"]:::user
        U4["Automated Engine (Service Role)"]:::user
    end

    subgraph API_GATEWAY["Nitro Server API & Auth Guard"]
        G1["Public Endpoints (/api/health, /api/satellite/tiles)"]:::auth
        G2["CSRF Protected Endpoints (/api/observations/create)"]:::auth
        G3["Role Protected Endpoints (/api/alerts/dispatch, /api/observations/review)"]:::auth
        G4["Internal Service Endpoints (/api/recompute, /api/satellite/jobs)"]:::auth
    end

    subgraph RLS_POLICIES["PostgreSQL Row-Level Security"]
        P1["SELECT: True (Public Read for Zones & Alerts)"]:::rls
        P2["INSERT: auth.uid() == user_id (Citizen Observations)"]:::rls
        P3["UPDATE/DELETE: auth.jwt().role == 'official' (Observation Review)"]:::rls
        P4["BYPASS: Service Role Key (Batch Ingestion & Jobs)"]:::rls
    end

    subgraph TABLES["Protected Database Entities"]
        T1[("risk_zones<br/>weather_readings")]:::data
        T2[("field_observations<br/>field-observation-media")]:::data
        T3[("emergency_alerts<br/>satellite_processing_jobs")]:::data
        T4[("risk_model_config<br/>(Single Active Row Constraint)")]:::data
    end

    U1 --> G1 --> P1 --> T1
    U2 --> G2 --> P2 --> T2
    U3 --> G3 --> P3 --> T2 & T3
    U4 --> G4 --> P4 --> T1 & T3 & T4
```

---

## How to View and Export These Diagrams

1. **Mermaid Live Editor**:
   - Go to [https://mermaid.live](https://mermaid.live).
   - Copy any of the code blocks above and paste them into the code panel to render, edit, or download high-resolution SVG/PNG files.
2. **VS Code / Cursor / IDE**:
   - Install the **Markdown Preview Mermaid Support** extension to view rendered diagrams inline.
3. **Notion / GitHub / GitLab**:
   - Paste the block directly inside code blocks formatted as ````mermaid ... ````.
