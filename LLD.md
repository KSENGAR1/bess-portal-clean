# Low-Level Design (LLD) — BESS Energy Management Portal
**Version:** 1.0.0 | **Date:** July 2026 | **Status:** Demo Phase → Production Roadmap

---

## 1. Document Purpose

This LLD describes the internal design of the BESS (Battery Energy Storage System) Portal — covering component architecture, data models, API contracts, state management, and production implementation guidelines. It bridges the current demo frontend with the full production system.

---

## 2. System Overview

The portal is a multi-role, multi-tenant energy management web application serving three distinct user types across residential complexes fitted with smart meters, BESS units, and solar PV arrays.

### 2.1 User Roles & Hierarchy

```
┌─────────────────────────────────────────────┐
│              SUPER ADMIN                    │
│  Platform owner · manages all orgs          │
│  15+ pages · purple theme                   │
├─────────────────────────────────────────────┤
│                  ADMIN                      │
│  Society manager · manages one project      │
│  10 pages · amber theme                     │
├─────────────────────────────────────────────┤
│                RESIDENT                     │
│  End user · manages own flat/meter          │
│  8 pages · blue theme · bottom nav          │
└─────────────────────────────────────────────┘
```

### 2.2 Tech Stack (Current Demo)

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18.2 |
| Build Tool | Vite 4.3 |
| Styling | Tailwind CSS 3.3 |
| Charts | Recharts 2.10 |
| Icons | Lucide React 0.263 |
| State | React Context API + useState |
| Routing | Custom (App.jsx switch) |
| Storage | localStorage (session only) |

---

## 3. Frontend Architecture

### 3.1 Directory Structure

```
src/
├── App.jsx                    # Root: auth, routing, layout selection
├── main.jsx                   # React entry, context providers
├── index.css                  # Global Tailwind + custom classes
│
├── context/
│   ├── CurrencyContext.jsx    # Global currency/region state
│   └── NotificationStore.jsx  # Cross-role notification bus
│
├── layouts/
│   ├── SidebarLayout.jsx      # Admin/SuperAdmin shell (sidebar + header)
│   ├── ResidentLayout.jsx     # Resident shell (top header + bottom nav)
│   ├── NavLink.jsx            # Single sidebar nav item
│   ├── SidebarSection.jsx     # Sidebar section label
│   └── index.js               # Layout exports
│
├── components/
│   ├── ToastProvider.jsx      # Global toast notification system
│   ├── BatteryGauge.jsx       # Animated battery SOC gauge
│   ├── BessPowerFlow.jsx      # Real-time power flow diagram
│   ├── CarbonCard.jsx         # CO2 savings display card
│   ├── DataTable.jsx          # Sortable/searchable/paginated table
│   ├── LithOnLogo.jsx         # Brand logo component
│   ├── SkeletonCard.jsx       # Loading skeleton placeholder
│   └── SolarTracker.jsx       # Solar generation tracker
│
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx      # Resident dashboard
│   ├── MeterPage.jsx
│   ├── WalletPage.jsx
│   ├── PaymentPage.jsx
│   ├── InvoicesPage.jsx
│   ├── NotificationsPage.jsx
│   ├── ProfilePage.jsx
│   ├── EnergyFlowPage.jsx
│   ├── BatteryHealthPage.jsx
│   ├── SolarPage.jsx
│   ├── AdminDashboard.jsx
│   ├── SuperAdminDashboard.jsx
│   │
│   ├── Admin/                 # 9 admin-specific pages
│   │   ├── AdminConsumers.jsx
│   │   ├── AdminMeters.jsx
│   │   ├── AdminBilling.jsx
│   │   ├── AdminPayments.jsx
│   │   ├── AdminComplaints.jsx
│   │   ├── AdminAlerts.jsx
│   │   ├── AdminReports.jsx
│   │   ├── AdminNotices.jsx
│   │   └── AdminSettings.jsx
│   │
│   └── SuperAdmin/            # 14 superadmin-specific pages
│       ├── SuperAdminProjects.jsx
│       ├── SuperAdminOrganizations.jsx
│       ├── SuperAdminAdmins.jsx
│       ├── SuperAdminUsers.jsx
│       ├── SuperAdminMeters.jsx
│       ├── SuperAdminTariff.jsx
│       ├── SuperAdminBilling.jsx
│       ├── SuperAdminLogs.jsx
│       ├── SuperAdminMonitoring.jsx
│       ├── SuperAdminRoles.jsx
│       ├── SuperAdminFirmware.jsx
│       ├── SuperAdminAudit.jsx
│       ├── SuperAdminBackup.jsx
│       └── SuperAdminAPI.jsx
│
└── utils/
    └── chartTheme.js          # Recharts shared theme tokens
```

---

## 4. Routing Design

### 4.1 Current Implementation (Demo)

Routing is handled by a `switch` statement in `App.jsx` — no React Router. Navigation is a shared `currentPage` string passed as `onNavigate` callback.

```
App.jsx
  ├── isLoggedIn === false  →  LoginPage
  └── isLoggedIn === true
        ├── userRole === 'resident'   →  ResidentLayout  →  renderPage()
        ├── userRole === 'admin'      →  SidebarLayout   →  renderPage()
        └── userRole === 'superadmin' →  SidebarLayout   →  renderPage()
```

### 4.2 Production Routing (Recommended: React Router v6)

```
/                          →  redirect to /login
/login                     →  LoginPage
/resident/
  dashboard                →  DashboardPage
  meter                    →  MeterPage
  wallet                   →  WalletPage
  payment                  →  PaymentPage
  invoices                 →  InvoicesPage
  notifications            →  NotificationsPage
  profile                  →  ProfilePage
  energy-flow              →  EnergyFlowPage
  battery-health           →  BatteryHealthPage
  solar                    →  SolarPage

/admin/
  dashboard                →  AdminDashboard
  consumers                →  AdminConsumers
  meters                   →  AdminMeters
  billing                  →  AdminBilling
  payments                 →  AdminPayments
  complaints               →  AdminComplaints
  alerts                   →  AdminAlerts
  reports                  →  AdminReports
  notices                  →  AdminNotices
  settings                 →  AdminSettings

/superadmin/
  dashboard                →  SuperAdminDashboard
  projects                 →  SuperAdminProjects
  organizations            →  SuperAdminOrganizations
  admins                   →  SuperAdminAdmins
  users                    →  SuperAdminUsers
  meters                   →  SuperAdminMeters
  tariff                   →  SuperAdminTariff
  billing                  →  SuperAdminBilling
  system-logs              →  SuperAdminLogs
  monitoring               →  SuperAdminMonitoring
  roles                    →  SuperAdminRoles
  firmware                 →  SuperAdminFirmware
  audit                    →  SuperAdminAudit
  backup                   →  SuperAdminBackup
  api                      →  SuperAdminAPI
```

### 4.3 Route Guards (Production)

```
PrivateRoute
  ├── checks JWT token validity
  ├── checks role === required role
  └── redirects to /login if invalid

RoleGuard
  ├── resident  → can only access /resident/*
  ├── admin     → can only access /admin/*
  └── superadmin → can access /superadmin/* + /admin/* (read-only)
```

---

## 5. State Management Design

### 5.1 Current State Architecture (Demo)

```
App.jsx (root state)
├── isLoggedIn: boolean
├── userRole: 'resident' | 'admin' | 'superadmin'
├── currentPage: string
├── dark: boolean                  → persisted in localStorage
├── showDemoBanner: boolean        → persisted in localStorage
└── walletBalance: number          → lifted state, passed down

Context Providers (global state)
├── ToastProvider
│   └── toasts[]  →  addToast(message, type, duration)
├── CurrencyProvider
│   ├── country: CountryObject
│   └── setCountry(code)           → persisted in localStorage
└── NotificationProvider
    ├── notifications[]
    ├── sendNotification(payload)  → Admin→Resident bridge
    ├── markRead(id)
    ├── markAllRead()
    └── unreadCount: number
```

### 5.2 Production State Architecture (Recommended: Zustand)

```
stores/
├── authStore.js
│   ├── user: UserObject | null
│   ├── token: string | null
│   ├── role: Role
│   ├── login(credentials) → async
│   ├── logout()
│   └── refreshToken() → async
│
├── walletStore.js
│   ├── balance: number
│   ├── transactions: Transaction[]
│   ├── fetchBalance() → async
│   └── addFunds(amount) → async
│
├── meterStore.js
│   ├── liveReadings: MeterReading
│   ├── history: Reading[]
│   ├── isOnline: boolean
│   └── subscribe() → WebSocket connection
│
├── notificationStore.js
│   ├── notifications: Notification[]
│   ├── unreadCount: number
│   ├── fetch() → async
│   └── markRead(id) → async
│
└── adminStore.js
    ├── consumers: Consumer[]
    ├── meters: Meter[]
    ├── alerts: Alert[]
    └── refresh() → async
```

---

## 6. Data Models

### 6.1 Core Entities

```typescript
// User / Resident
interface User {
  id: string
  name: string
  phone: string
  email: string
  role: 'resident' | 'admin' | 'superadmin'
  flatId: string
  organizationId: string
  walletBalance: number
  status: 'Active' | 'Inactive' | 'Suspended'
  createdAt: ISO8601
  lastLogin: ISO8601
}

// Organization (Society/Building)
interface Organization {
  id: string
  name: string
  city: string
  country: string
  adminIds: string[]
  projectIds: string[]
  tariffId: string
  status: 'Active' | 'Inactive'
  since: ISO8601
}

// Project (within Organization)
interface Project {
  id: string
  organizationId: string
  name: string
  city: string
  totalMeters: number
  admins: number
  consumers: number
  health: 'Healthy' | 'Degraded' | 'Offline'
  status: 'Active' | 'Inactive'
  bessUnits: BESSUnit[]
  since: ISO8601
}

// Smart Meter
interface Meter {
  id: string                  // MTR-001
  flatId: string
  organizationId: string
  projectId: string
  type: 'Grid' | 'DG'
  status: 'Online' | 'Offline' | 'Tamper'
  firmwareVersion: string
  signalStrength: number      // 0-100
  lastSync: ISO8601
  balance: number
  sanctionedLoad: number      // kW
  liveLoad: number            // kW
  reading: number             // kWh cumulative
}

// BESS Unit
interface BESSUnit {
  id: string
  projectId: string
  location: string
  soc: number                 // State of Charge 0-100%
  health: number              // 0-100%
  temperature: number         // Celsius
  status: 'Healthy' | 'Degraded' | 'Maintenance'
  capacity: number            // kWh
  solarConnected: boolean
  solarGenToday: number       // kWh
  peakShaved: number          // kW
}

// Tariff
interface Tariff {
  id: string
  projectId: string
  gridRate: number            // per kWh
  dgRate: number              // per kWh
  fixedCharge: number         // monthly
  freeUnits: number           // kWh/month slab
  gstRate: number             // percentage
  lateFee: number             // percentage
  effectiveFrom: ISO8601
}

// Bill / Invoice
interface Invoice {
  id: string
  userId: string
  meterId: string
  month: string               // "June 2024"
  gridUnits: number
  dgUnits: number
  gridAmount: number
  dgAmount: number
  fixedCharge: number
  gstAmount: number
  totalAmount: number
  status: 'Paid' | 'Unpaid' | 'Overdue'
  dueDate: ISO8601
  paidAt: ISO8601 | null
}

// Transaction
interface Transaction {
  id: string
  userId: string
  type: 'credit' | 'debit'
  category: 'recharge' | 'grid' | 'dg' | 'fixed' | 'refund'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string
  paymentMethod: string | null
  createdAt: ISO8601
}

// Alert
interface Alert {
  id: string
  projectId: string
  type: 'Tamper' | 'Offline' | 'HighConsumption' | 'LowBalance' | 'LowVoltage'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  affectedMeters: string[]
  description: string
  acknowledged: boolean
  acknowledgedBy: string | null
  createdAt: ISO8601
}

// Notification
interface Notification {
  id: string
  userId: string
  category: 'billing' | 'meter' | 'payment' | 'notice' | 'alert'
  title: string
  message: string
  read: boolean
  actionPage: string | null
  createdAt: ISO8601
}
```

---

## 7. API Design (REST)

### 7.1 Base URL & Auth

```
Base URL:    https://api.bess.io/v1
Auth:        Bearer JWT in Authorization header
Token TTL:   15 minutes (access) + 7 days (refresh)
Rate Limit:  100 req/min per user, 1000 req/min per admin
```

### 7.2 Auth Endpoints

```
POST   /auth/send-otp          { phone, dialCode }
POST   /auth/verify-otp        { phone, otp } → { accessToken, refreshToken, user }
POST   /auth/login             { email, password } → { accessToken, refreshToken, user }
POST   /auth/refresh           { refreshToken } → { accessToken }
POST   /auth/logout            { refreshToken }
```

### 7.3 Resident Endpoints

```
GET    /resident/me                    → User profile
PATCH  /resident/me                    { name, email }

GET    /resident/meter                 → Live meter reading + liveLoad
GET    /resident/meter/history         ?period=daily|monthly → Reading[]
GET    /resident/meter/parameters      → { voltage, current, powerFactor, frequency }

GET    /resident/wallet                → { balance, lastUpdated }
GET    /resident/wallet/transactions   ?page&limit → Transaction[]
POST   /resident/wallet/recharge       { amount, paymentMethod }

GET    /resident/invoices              ?page&limit → Invoice[]
GET    /resident/invoices/:id          → Invoice (PDF download link)

GET    /resident/notifications         ?page&limit → Notification[]
PATCH  /resident/notifications/:id/read
PATCH  /resident/notifications/read-all

GET    /resident/bess/status           → { soc, health, solarGen, gridImport, loadDemand }
GET    /resident/bess/energy-flow      → Real-time power flow data
```

### 7.4 Admin Endpoints

```
GET    /admin/dashboard                → Aggregated society stats
GET    /admin/consumers                ?search&status&page → Consumer[]
GET    /admin/consumers/:id            → Consumer detail
PATCH  /admin/consumers/:id/status     { status }

GET    /admin/meters                   ?status&page → Meter[]
POST   /admin/meters/:id/ping          → Trigger ping
POST   /admin/meters/:id/relay         { state: 'on'|'off' }

POST   /admin/billing/generate         { month } → BulkBillJob
GET    /admin/billing/status           ?month → Bill[]
POST   /admin/billing/remind/:userId

GET    /admin/payments                 ?page&status → Payment[]
GET    /admin/complaints               ?status&page → Complaint[]
PATCH  /admin/complaints/:id           { status, note }

POST   /admin/notices                  { title, body, type } → broadcast
GET    /admin/alerts                   ?priority&ack → Alert[]
PATCH  /admin/alerts/:id/acknowledge

GET    /admin/reports/consumption      ?month → ConsumptionReport
GET    /admin/reports/revenue          ?month → RevenueReport
GET    /admin/reports/export           ?type=pdf|csv → file download
```

### 7.5 SuperAdmin Endpoints

```
GET    /superadmin/organizations       → Organization[]
POST   /superadmin/organizations       { name, city, ... }
PATCH  /superadmin/organizations/:id

GET    /superadmin/projects            → Project[]
POST   /superadmin/projects            { name, organizationId, ... }
PATCH  /superadmin/projects/:id/status { status }

GET    /superadmin/admins              → Admin[]
POST   /superadmin/admins              { name, email, projectId, ... }
DELETE /superadmin/admins/:id

GET    /superadmin/meters              ?org&status → Meter[]
POST   /superadmin/meters/:id/reboot
POST   /superadmin/meters/sync-all

GET    /superadmin/tariff/:projectId   → Tariff
PUT    /superadmin/tariff/:projectId   { gridRate, dgRate, ... }

GET    /superadmin/monitoring          → SystemHealth
GET    /superadmin/logs                ?level&service&page → Log[]
GET    /superadmin/audit               ?severity&page → AuditLog[]

GET    /superadmin/firmware/versions   → FirmwareVersion[]
POST   /superadmin/firmware/upload     multipart/form-data
POST   /superadmin/firmware/push       { projectId, version }

GET    /superadmin/api-keys            → APIKey[]
POST   /superadmin/api-keys            { name, permissions }
POST   /superadmin/api-keys/:id/rotate
DELETE /superadmin/api-keys/:id

POST   /superadmin/backup/trigger
GET    /superadmin/backup/list         → Backup[]
POST   /superadmin/backup/:id/restore
```

---

## 8. Real-Time Data Design (WebSocket)

Smart meters and BESS units push data continuously. The portal needs live updates for:
- Meter live load and readings
- BESS SOC, temperature, power flow
- System alerts

### 8.1 WebSocket Channel Map

```
Connection:  wss://api.bess.io/v1/ws?token=<JWT>

Channels (subscribe on connect):
├── meter:{meterId}:live        → { liveLoad, voltage, current, frequency, powerFactor }
├── bess:{unitId}:live          → { soc, temp, solarGen, gridImport, loadDemand }
├── org:{orgId}:alerts          → Alert (new critical alerts)
└── project:{projectId}:meters  → Meter status changes (online/offline/tamper)

Heartbeat:   ping every 30s, server pong expected within 5s
Reconnect:   exponential backoff, max 30s interval
```

### 8.2 Current Demo vs Production

| Feature | Demo | Production |
|---------|------|-----------|
| Meter readings | Static hardcoded values | WebSocket from MQTT broker |
| BESS status | Simulated with setInterval | WebSocket from BMS API |
| Alerts | Static array | Server-sent events |
| System monitoring | Random data every 3s | Real Prometheus metrics |
| Notifications | In-memory React state | Server push via WebSocket |

---

## 9. Component Design

### 9.1 DataTable Component

Reusable across all listing pages (Consumers, Meters, Users, etc.)

```
Props:
  data: T[]                     Required
  columns: ColumnDef[]          Required
  searchable: boolean           Optional (default: false)
  sortable: boolean             Optional (default: false)
  pageSize: number              Optional (default: 10)
  onRowClick: (row: T) => void  Optional

ColumnDef:
  key: string                   Data field key
  label: string                 Header label
  render: (value) => ReactNode  Optional custom cell renderer
  sortable: boolean             Optional
  width: string                 Optional

Internal State:
  searchQuery: string
  sortKey: string | null
  sortDir: 'asc' | 'desc'
  currentPage: number

Data Flow:
  data → filter(search) → sort → paginate → render
```

### 9.2 ToastProvider Component

```
Context exposes:
  addToast(message, type, duration?)
    type: 'success' | 'error' | 'warning' | 'info'
    duration: number (ms, default 3500)

Internal State:
  toasts: { id, message, type, visible }[]

Lifecycle:
  addToast → push to array → setTimeout(remove, duration)
  Limit: max 4 toasts visible simultaneously
  Animation: slide in from right, fade out
```

### 9.3 SidebarLayout Component

```
Props:
  navItems: NavItem[]         Section labels + page links
  searchMap: SearchEntry[]    Keyword → page mapping
  theme: 'purple' | 'amber'  Color scheme
  currentPage: string
  onNavigate: (page) => void

Features:
  - Sticky sidebar (desktop)
  - Mobile: off-canvas with overlay
  - Escape key closes mobile sidebar
  - Live search with dropdown suggestions
  - Dark/light mode toggle
  - Notification bell with unread badge
  - User profile shortcut
  - Logout button
```

### 9.4 BessPowerFlow Component

```
Props:
  compact: boolean   (mini version for dashboard cards)

Modes:
  compact = false → Full animated diagram with node labels
  compact = true  → Simplified 3-node diagram

Nodes:
  Solar PV → BESS ↔ Grid
                ↓
              Load

Data (production):
  WebSocket subscription to bess:{unitId}:live
  Updates every 2 seconds
```

---

## 10. Authentication & Authorization

### 10.1 Login Flow

```
OTP Login:
  1. User enters phone + selects country code
  2. POST /auth/send-otp → SMS via Twilio/MSG91
  3. User enters 4-digit OTP
  4. POST /auth/verify-otp → returns JWT pair + User object
  5. Store accessToken in memory (not localStorage)
  6. Store refreshToken in httpOnly cookie

Email Login:
  1. User enters email + password
  2. POST /auth/login → returns JWT pair + User object
  3. Same token storage as above
```

### 10.2 Token Strategy

```
Access Token:
  - JWT, 15 min TTL
  - Stored in memory (React state / Zustand)
  - Sent as Authorization: Bearer <token>
  - Lost on page refresh → triggers silent refresh

Refresh Token:
  - Stored in httpOnly cookie (XSS-safe)
  - 7 day TTL
  - Auto-rotated on each refresh call
  - Revoked on logout

Silent Refresh:
  - Axios interceptor catches 401
  - Calls POST /auth/refresh automatically
  - Retries original request with new token
  - If refresh fails → redirect to /login
```

### 10.3 Role-Based Access Control (RBAC)

```
Permissions Matrix:

Resource              Resident  Admin  SuperAdmin
──────────────────────────────────────────────────
Own meter data          ✅        ✅       ✅
Own wallet              ✅        ✅       ✅
Own invoices            ✅        ✅       ✅
Society consumers       ❌        ✅       ✅
All meters (society)    ❌        ✅       ✅
Bill generation         ❌        ✅       ✅
Society settings        ❌        ✅       ✅
All organizations       ❌        ❌       ✅
Tariff management       ❌      limited    ✅
Firmware OTA            ❌        ❌       ✅
System monitoring       ❌        ❌       ✅
Audit logs              ❌        ❌       ✅
API key management      ❌        ❌       ✅
Backup/Restore          ❌        ❌       ✅
```

---

## 11. Billing Engine Design

The billing engine is one of the most critical modules. It runs automatically on the 1st of every month.

### 11.1 Bill Generation Flow

```
Trigger: Cron job → 1st of month, 00:01 AM

Step 1: Fetch all active consumers for an organization
Step 2: For each consumer:
    a. Fetch meter readings for the billing period
       - gridUnits = end_reading - start_reading (Grid meter)
       - dgUnits   = end_reading - start_reading (DG meter)
    b. Fetch applicable tariff (organization tariff)
    c. Calculate:
       gridAmount  = gridUnits × tariff.gridRate
       dgAmount    = dgUnits × tariff.dgRate
       fixedCharge = tariff.fixedCharge
       subTotal    = gridAmount + dgAmount + fixedCharge
       freeUnitsCredit = min(gridUnits, tariff.freeUnits) × tariff.gridRate
       taxAmount   = (subTotal - freeUnitsCredit) × tariff.gstRate / 100
       lateFee     = previousUnpaid × tariff.lateFee / 100
       total       = subTotal - freeUnitsCredit + taxAmount + lateFee
    d. Create Invoice record
    e. Deduct from wallet if auto-debit enabled
    f. Send notification to resident
Step 3: Generate summary report for Admin
Step 4: Log billing run to AuditLog
```

### 11.2 Bill Preview Calculation

Available in SuperAdmin Tariff page — real-time estimate:

```
inputs:  gridRate, dgRate, fixedCharge, gstRate, sampleUnits(250 grid + 50 DG)
preview: (gridRate × 250) + (dgRate × 50) + fixedCharge
         × (1 + gstRate/100)
```

---

## 12. Notification System Design

### 12.1 Current Demo Architecture

```
NotificationStore (React Context)
  ├── sendNotification()    — Admin posts a notice
  │   └── Appends to notifications[] in memory
  └── Resident's NotificationsPage reads same array
      (simulates admin → resident broadcast)
```

### 12.2 Production Architecture

```
Admin creates notice
    │
    ▼
POST /admin/notices
    │
    ▼
Server stores in DB
    │
    ├──→ Push to all resident WebSocket connections
    ├──→ Send FCM push notification (mobile)
    └──→ Send SMS via Twilio (optional)
         │
         ▼
Resident sees bell badge increment (real-time)
Resident opens Notifications page → fetches from GET /resident/notifications
```

### 12.3 Notification Categories & Triggers

```
Category    Trigger                              Priority
─────────────────────────────────────────────────────────
billing     Monthly bill generated               Normal
billing     Payment due reminder (3 days)        Normal
billing     Overdue payment (after due date)      High
meter       DG/Grid source switch                Normal
meter       Meter offline > 30 mins              High
meter       Tamper detection                     Critical
payment     Wallet recharge successful           Normal
payment     Low balance (< threshold)            High
payment     Critical balance (< 500)             Critical
notice      Admin broadcast notice               Varies
alert       Power outage                         Critical
```

---

## 13. Database Schema (Production)

### 13.1 Recommended Database

```
Primary DB:   PostgreSQL 15
  → Relational data: users, orgs, billing, transactions

Time-Series:  TimescaleDB (PostgreSQL extension)
  → Meter readings, energy data (10,000+ inserts/min)

Cache:        Redis
  → Sessions, rate limiting, live meter data buffer

Message Bus:  Apache Kafka
  → Meter reading events, alert pipeline

Object Store: AWS S3 / MinIO
  → Invoice PDFs, firmware binaries, backup archives
```

### 13.2 Key Tables

```sql
-- Users
users (id, name, email, phone, role, org_id, flat_id,
       password_hash, status, created_at, last_login)

-- Organizations
organizations (id, name, city, country_code, status,
               tariff_id, created_at)

-- Projects
projects (id, org_id, name, city, status, health,
          created_at)

-- Flats / Units
flats (id, project_id, unit_number, tower, floor, area_sqft)

-- Smart Meters
meters (id, flat_id, project_id, type, serial_number,
        firmware_version, status, signal_strength,
        sanctioned_load, installed_at, last_sync)

-- Meter Readings (TimescaleDB hypertable)
meter_readings (meter_id, timestamp, reading_kwh,
                live_load_kw, voltage, current,
                power_factor, frequency)
  → partitioned by timestamp (daily chunks)
  → retention: 2 years raw, 5 years monthly aggregates

-- BESS Units
bess_units (id, project_id, location, capacity_kwh,
            status, installed_at)

-- BESS Telemetry (TimescaleDB)
bess_telemetry (unit_id, timestamp, soc, health_pct,
                temperature, solar_gen_kw, grid_import_kw,
                load_demand_kw, battery_power_kw)

-- Tariffs
tariffs (id, project_id, grid_rate, dg_rate, fixed_charge,
         free_units, gst_rate, late_fee, effective_from,
         created_by)

-- Invoices
invoices (id, user_id, meter_id, billing_month,
          grid_units, dg_units, grid_amount, dg_amount,
          fixed_charge, gst_amount, total_amount, status,
          due_date, paid_at)

-- Transactions
transactions (id, user_id, type, category, amount,
              balance_before, balance_after, description,
              payment_method, gateway_ref, created_at)

-- Wallets
wallets (id, user_id, balance, last_updated)

-- Notifications
notifications (id, user_id, category, title, message,
               read, action_page, created_at)

-- Audit Logs
audit_logs (id, user_id, role, action, module,
            project_id, ip_address, severity,
            payload_json, created_at)

-- API Keys
api_keys (id, name, key_hash, permissions_json,
          status, created_by, last_used_at, created_at)

-- Firmware
firmware_versions (id, version, status, release_notes,
                   file_url, file_size, uploaded_by, created_at)
```

---

## 14. Backend Service Architecture (Production)

### 14.1 Microservice Breakdown

```
API Gateway (Kong / AWS API GW)
  ├── Rate limiting, auth token validation
  ├── Routes to services below
  └── WebSocket proxy

Services:
├── auth-service           Login, OTP, JWT issuance/refresh
├── user-service           Profile, role management
├── meter-service          Meter data, MQTT ingestion
├── bess-service           BESS telemetry, energy flow
├── billing-service        Invoice generation, tariff engine
├── payment-service        Wallet, Razorpay integration
├── notification-service   Push, SMS, WebSocket delivery
├── report-service         PDF/CSV generation, analytics
├── firmware-service       OTA management, rollout
├── audit-service          Log ingestion, audit trail
└── backup-service         Scheduled backups, S3 upload

Infrastructure:
├── MQTT Broker (EMQX)     ← Smart meters push readings
├── Kafka                  ← Event streaming between services
├── Redis                  ← Cache, pub/sub, rate limiting
├── PostgreSQL + TimescaleDB ← Primary data store
├── S3 / MinIO             ← Files, PDFs, firmware binaries
└── Prometheus + Grafana   ← System monitoring (feeds SuperAdmin Monitor page)
```

### 14.2 Meter Data Ingestion Pipeline

```
Smart Meter (hardware)
    │  MQTT publish every 10s
    ▼
EMQX MQTT Broker
    │  topic: meters/{meterId}/readings
    ▼
meter-service (MQTT subscriber)
    ├── Validate payload
    ├── Write to TimescaleDB (meter_readings)
    ├── Update Redis cache (live reading)
    ├── Publish to Kafka topic: meter.reading.new
    └── WebSocket push to subscribed portal clients

Kafka consumer (alert-service)
    ├── Check thresholds (high load, offline, tamper)
    └── If triggered → Create Alert → Notify Admin
```

---

## 15. Security Design

### 15.1 Frontend Security

```
- No sensitive data in localStorage (only preferences)
- JWT access token in memory only (not localStorage)
- Refresh token in httpOnly cookie
- All API calls over HTTPS only
- Content Security Policy headers
- Input sanitization on all form fields
- XSS: React's JSX escaping + DOMPurify for any innerHTML
- CSRF: SameSite=Strict cookies + CSRF tokens for state-changing ops
```

### 15.2 API Security

```
- JWT validation on every protected endpoint
- Role check middleware before controller execution
- Organization-scoped queries (admin can't access other org's data)
- Rate limiting: 100 req/min (user), 1000 req/min (admin)
- Input validation: Zod schema on all request bodies
- SQL injection: ORM parameterized queries (no raw SQL)
- Sensitive fields (passwords, keys): bcrypt hashing
- API keys: stored as SHA-256 hash, never plaintext
- Audit log: every admin/superadmin action logged
```

### 15.3 Data Privacy

```
- PII fields encrypted at rest (AES-256): phone, email, address
- Meter data anonymized in reports (aggregate only for non-admin)
- GDPR-ready: user data export, deletion endpoints
- Log retention: 90 days raw logs, 1 year aggregated
```

---

## 16. Error Handling Design

### 16.1 Frontend Error States

Every page that fetches data needs these states:

```
Loading   → SkeletonCard components (already built)
Success   → Render data
Empty     → "No results" illustration + CTA
Error     → Error card with retry button
Offline   → "No connection" banner

Implementation (production):
const { data, loading, error, refetch } = useQuery('/endpoint')

if (loading) return <SkeletonCard />
if (error)   return <ErrorCard onRetry={refetch} />
if (!data?.length) return <EmptyState />
return <DataTable data={data} />
```

### 16.2 API Error Codes

```
400  Bad Request       → Validation error (show field errors)
401  Unauthorized      → Token expired (trigger silent refresh)
403  Forbidden         → Role mismatch (show "Access Denied")
404  Not Found         → Resource missing (show empty state)
409  Conflict          → Duplicate resource (show specific message)
422  Unprocessable     → Business logic error (show toast)
429  Too Many Requests → Rate limited (show cooldown timer)
500  Server Error      → Generic "Something went wrong" + error ID
503  Service Down      → Maintenance page
```

---

## 17. Payment Integration Design

### 17.1 Payment Flow (Razorpay)

```
Resident clicks "Add Money"
    │
    ▼
POST /resident/wallet/recharge/initiate
  → { orderId, amount, razorpayKeyId }
    │
    ▼
Frontend opens Razorpay checkout modal
    │
    ▼
User completes payment (UPI / Card / NetBanking)
    │
    ▼
Razorpay sends webhook → POST /payments/webhook
  → Verify signature (HMAC SHA256)
  → Credit wallet balance
  → Create Transaction record
  → Send success notification to resident
    │
    ▼
Frontend polls GET /resident/wallet
  → Balance updated
  → Show success toast
```

### 17.2 Payment Methods Supported

```
UPI (Google Pay, PhonePe, Paytm, BHIM)
Cards (Visa, Mastercard, Rupay — debit + credit)
Net Banking (50+ banks)
Wallets (Paytm, Amazon Pay)
EMI (for large top-ups)
```

---

## 18. Multi-Tenancy Design

The platform serves multiple organizations. Data isolation is critical.

### 18.1 Isolation Strategy

```
Database Level:
  - Every table has org_id / project_id column
  - Queries ALWAYS include WHERE org_id = :requestingOrgId
  - Database RLS (Row Level Security) as second layer

API Level:
  - Admin JWT contains { userId, orgId, role }
  - Middleware extracts orgId from token
  - All queries scoped to that orgId
  - SuperAdmin has orgId = null (access all)

Application Level:
  - Admin cannot call SuperAdmin endpoints
  - Admin can only see their project's data
  - All reports scoped to requesting admin's org
```

---

## 19. Performance Design

### 19.1 Frontend Performance

```
Code Splitting:
  - Each role's pages in separate lazy-loaded chunks
  - Admin pages not loaded until admin logs in
  - SuperAdmin pages not loaded until superadmin logs in
  - Expected bundle savings: ~60%

Memoization:
  - useMemo for filtered/sorted data arrays
  - useCallback for event handlers in lists
  - React.memo for heavy chart components

Virtual Scrolling:
  - Required for Meters list (5000+ rows)
  - Required for System Logs (high volume)
  - Library: react-virtual

Image Optimization:
  - Logo served as WebP with PNG fallback
  - Lazy loading for all non-critical images
```

### 19.2 API Performance

```
Caching Strategy:
  - Redis TTL 60s for live meter readings
  - Redis TTL 5min for dashboard stats
  - Redis TTL 24h for static tariff data

Database Indexes:
  - meter_readings(meter_id, timestamp DESC)  -- most read
  - transactions(user_id, created_at DESC)
  - notifications(user_id, read, created_at DESC)
  - audit_logs(org_id, created_at DESC)

Pagination:
  - All list endpoints: cursor-based pagination
  - Default page size: 20
  - Max page size: 100
```

---

## 20. Current Demo → Production Migration Checklist

### Phase 1: Core Backend (Month 1)
- [ ] Set up PostgreSQL + TimescaleDB
- [ ] Implement auth-service (OTP + email login, JWT)
- [ ] Implement user-service (CRUD, roles)
- [ ] Wire up LoginPage to real auth API
- [ ] Replace localStorage session with JWT
- [ ] Implement wallet-service + payment integration
- [ ] Wire up WalletPage and PaymentPage to real API

### Phase 2: Meter & Billing (Month 2)
- [ ] Set up MQTT broker (EMQX)
- [ ] Implement meter-service with MQTT ingestion
- [ ] Wire up MeterPage live readings via WebSocket
- [ ] Implement billing-service (tariff engine, invoice generation)
- [ ] Wire up AdminBilling and InvoicesPage to real API
- [ ] Wire up AdminTariff / SuperAdminTariff to real API

### Phase 3: Admin Features (Month 2-3)
- [ ] Wire up AdminConsumers, AdminMeters, AdminAlerts
- [ ] Implement notification-service
- [ ] Wire up AdminNotices → push to residents
- [ ] Implement report generation (PDF/CSV)
- [ ] Wire up AdminReports export buttons

### Phase 4: SuperAdmin Features (Month 3)
- [ ] Wire up SuperAdminProjects, SuperAdminOrganizations
- [ ] Implement system monitoring (Prometheus metrics)
- [ ] Wire up SuperAdminMonitoring live charts
- [ ] Implement firmware-service + OTA flow
- [ ] Wire up SuperAdminFirmware push buttons
- [ ] Implement audit logging on all actions
- [ ] Wire up SuperAdminAudit, SuperAdminLogs

### Phase 5: Hardening (Month 3-4)
- [ ] Add error boundaries to all pages
- [ ] Add loading skeletons to all data fetches
- [ ] Implement token refresh interceptor
- [ ] Add input validation (React Hook Form + Zod)
- [ ] Security audit (pen test key endpoints)
- [ ] Set up CI/CD pipeline
- [ ] Performance profiling + bundle optimization
- [ ] E2E tests for critical flows (login, payment, billing)

---

## 21. Key Design Decisions & Rationale

| Decision | Choice | Reason |
|----------|--------|--------|
| Frontend framework | React 18 | Current demo uses it; large ecosystem |
| Routing | React Router v6 | Deep linking, browser back/forward support |
| State management | Zustand | Lighter than Redux, simpler than Context for large state |
| API style | REST | Simpler than GraphQL for this use case; easier mobile app integration later |
| Real-time | WebSocket | Bi-directional; better than polling for 5000+ meters |
| Primary DB | PostgreSQL | Relational data with strong ACID guarantees for billing |
| Meter time-series | TimescaleDB | Purpose-built for time-series, PostgreSQL-compatible |
| Payment | Razorpay | India-first, excellent UPI/mobile support |
| OTP | MSG91 / Twilio | Reliable SMS delivery in India |
| CSS | Tailwind CSS | Already used; consistent utility-first approach |
| Hosting | Vercel (frontend) + AWS/GCP (backend) | Current demo on Vercel; scales easily |

---

*LLD prepared from codebase analysis of BESS Portal v2.4.1 — July 2026*
*This document should be updated as features are implemented in production.*
