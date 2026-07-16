# BESS Portal — Financial & Technical Formula Reference

This document covers every formula, rate, threshold, and calculation used across the portal.
All monetary values default to **INR (₹)** unless the region is changed in Settings.

---

## Table of Contents

1. [Billing & Invoice Calculations](#1-billing--invoice-calculations)
2. [Collection Rate Calculations](#2-collection-rate-calculations)
3. [Revenue Aggregation](#3-revenue-aggregation)
4. [Wallet & Payment Logic](#4-wallet--payment-logic)
5. [Energy Flow Calculations](#5-energy-flow-calculations)
6. [Solar Generation Metrics](#6-solar-generation-metrics)
7. [BESS / Battery Metrics](#7-bess--battery-metrics)
8. [CO₂ & Carbon Offset](#8-co--carbon-offset)
9. [Currency System](#9-currency-system)
10. [Alert & Status Thresholds](#10-alert--status-thresholds)
11. [Known Inconsistencies & TODOs](#11-known-inconsistencies--todos)

---

## 1. Billing & Invoice Calculations

**Source:** `src/pages/InvoicesPage.jsx`, `src/pages/Admin/AdminBilling.jsx`, `src/pages/TowerAdmin/TowerAdminBilling.jsx`

### Default Tariff Rates

| Parameter | Default Value | Configurable in |
|---|---|---|
| Mains (Grid) Rate | ₹12 / kWh | Admin Settings → Tariff |
| DG (Diesel Generator) Rate | ₹45 / kWh | Admin Settings → Tariff |
| Fixed Monthly Charge | ₹250 | Admin Settings → Tariff |
| GST Rate | 18% (split 9% SGST + 9% CGST) | Admin Settings → Tariff |
| Late Payment Fee | 5% of outstanding | Admin Settings → General |
| Bill Due Day | 15th of the month | Admin Settings → General |
| Grace Period | 5 days | Admin Settings → General |

### Invoice Calculation Formula

```
Mains Charge   = Mains Units (kWh)  × Mains Rate
DG Charge      = DG Units (kWh)     × DG Rate
Subtotal       = Mains Charge + DG Charge + Fixed Monthly Charge

SGST           = Subtotal × 9%
CGST           = Subtotal × 9%
GST Total      = SGST + CGST  =  Subtotal × 18%

Grand Total    = Subtotal + SGST + CGST
             = Subtotal × 1.18
```

**Example (June 2024):**
```
Mains Charge   = 312.5 kWh × ₹12     = ₹3,750.00
DG Charge      = 74.7 kWh  × ₹45     = ₹3,361.50
Subtotal       = ₹3,750 + ₹3,361.50 + ₹250 = ₹7,361.50
  → Wait — grand total shown is ₹5,285, not ₹8,687.
  → The static `total` field is pre-set mock data.
     The GST formula above is live-computed only in the invoice detail view.
```

> **Note:** Static invoice list uses pre-set `total` values. The breakdown formula
> (mainsChrg + dgChrg + fixed + GST) is only applied when you open the invoice detail.

### Tower-Level Billing Aggregations

```
Total Revenue Collected  = SUM of all bill amounts where status === 'Paid'
Total Pending            = SUM of all bill amounts where status !== 'Paid'
```

---

## 2. Collection Rate Calculations

**Source:** `src/pages/CompanyAdmin/CompanyAdminBilling.jsx`, `src/pages/CompanyAdmin/CompanyAdminPayments.jsx`, `src/pages/Admin/AdminPayments.jsx`

### Formula A — Billing view (used in CompanyAdminBilling)

```
Collection Rate (%) = (Total Collected / Total Generated) × 100
```

### Formula B — Payments view (used in CompanyAdminPayments)

```
Collection Rate (%) = (Total Collected / (Total Collected + Total Pending)) × 100
```

> These two formulas give slightly different results. Formula A is more conservative
> (denominator includes write-offs or uncreated bills). Formula B reflects
> in-cycle recovery rate.

### Society-Level Collection Rates (demo data)

| Society | Generated | Collected | Pending | Rate (A) |
|---|---|---|---|---|
| ABC Residency | ₹4,52,350 | ₹4,07,120 | ₹45,230 | 90.0% |
| Green Valley | ₹3,25,400 | ₹2,96,900 | ₹28,500 | 91.2% |
| Sunrise Apartments | ₹5,78,900 | ₹5,13,500 | ₹65,400 | 88.7% |
| Palm Springs | ₹2,89,600 | ₹2,71,400 | ₹18,200 | 93.7% |
| Royal Gardens | ₹4,12,800 | ₹3,60,700 | ₹52,100 | 87.4% |

### Pending Risk Classification (AdminPayments)

```
High    →  Pending > ₹25,000
Medium  →  ₹15,000 ≤ Pending ≤ ₹25,000
Low     →  Pending < ₹15,000
```

### Collection Rate Color Thresholds (Dashboard)

```
≥ 95%   → Green  (Healthy)
≥ 90%   → Amber  (Monitor)
< 90%   → Red    (Attention)
```

---

## 3. Revenue Aggregation

**Source:** `src/pages/CompanyAdmin/CompanyAdminPerformance.jsx`, `src/pages/CompanyAdmin/CompanyAdminDashboard.jsx`

```
Total Portfolio Revenue  = SUM(revenue across all societies)
Average Collection Rate  = SUM(all society collection rates) / COUNT(societies)
                         ⚠️  Simple average — not revenue-weighted
Average Growth Rate      = SUM(all society growth %) / COUNT(societies)
```

Display notation: values ≥ 1,000 are shown as `k` (÷ 1000, 0 decimal places).
```
₹4,52,350  →  displayed as  ₹452k
```

### Month-over-Month Spending Change (Resident Dashboard)

```
Spending Change (%) = ((This Month Spend - Last Month Spend) / Last Month Spend) × 100
```

Example:
```
= ((₹3,250.75 - ₹2,890.50) / ₹2,890.50) × 100  =  +12.5%
```

---

## 4. Wallet & Payment Logic

**Source:** `src/pages/PaymentPage.jsx`, `src/pages/WalletPage.jsx`, `src/pages/DashboardPage.jsx`, `src/App.jsx`

### Wallet Balance

```
New Balance = Current Balance + Recharge Amount
```

No transaction fee or processing charge is applied (demo mode).

**Minimum recharge:** ₹100  
**Preset recharge amounts:** ₹500 · ₹1,000 · ₹2,000 · ₹5,000 · ₹10,000

### Wallet Health Indicator (Resident Dashboard)

```
Balance Bar Fill (%) = MIN(100,  (walletBalance / ₹5,000) × 100 )
```

| Wallet Balance | Indicator Color |
|---|---|
| < ₹1,000 | 🔴 Red — Critical |
| ₹1,000 – ₹2,999 | 🟡 Amber — Low |
| ≥ ₹3,000 | 🟢 Green — Healthy |

Low balance warning banner: shown when `walletBalance < ₹5,000`.

### Spending Breakdown (WalletPage — display percentages)

```
Grid Power    =  70% of monthly bill
DG Power      =  20% of monthly bill
Fixed Charge  =  10% of monthly bill
```

These are static demo percentages, not derived from actual meter readings.

### Monthly Average Spend

```
Monthly Average = ROUND( SUM(monthly amounts) / COUNT(months) )
```

Example (6 months): `(2800+3100+2950+3200+2800+3400) / 6 = ₹3,042`

---

## 5. Energy Flow Calculations

**Source:** `src/pages/EnergyFlowPage.jsx`, `src/components/BessPowerFlow.jsx`, `src/pages/TowerAdmin/TowerAdminBESS.jsx`

### Real-Time Power Dispatch Logic

The portal simulates live energy dispatch using this priority order:
**Solar → BESS → Grid**

```
net = Solar Generation (kW) - Load Demand (kW)

IF net ≥ 0  (surplus):
    Battery Charge  = MIN(net,  max_charge_rate)   // absorb surplus first
    Grid Export     = MAX(0,  net - Battery Charge) // export remaining

IF net < 0  (deficit):
    Battery Discharge = MIN(-net,  max_discharge_rate)  // BESS covers deficit first
    Grid Import       = MAX(0,  -net - Battery Discharge)  // grid covers the rest
```

### Component-Level Limits

| Component | EnergyFlowPage | BessPowerFlow (component) |
|---|---|---|
| Max Battery Charge Rate | 5 kW | 3 kW |
| Max Battery Discharge | 5 kW | 2 kW |
| Max Grid Import | 8 kW | uncapped |
| Max Grid Export | 8 kW | uncapped |

### Solar Curve Simulation (historical 24h data)

```
Solar Output (kW) = MAX( 0,  Peak × sin((hour - 6) × π / 12) + noise )
```

- Peaks at solar noon (~12:00)
- Zero before 06:00 and after 18:00
- `noise` = `Math.random() × 1.5` (random variation ±0–1.5 kW)

### System Efficiency

```
System Efficiency (%) = 88 + random(0–6)   →  88–94% range (simulated)
```

### Self-Sufficiency Rate

```
Self-Sufficiency (%) = (Solar Used On-Site / Total Load) × 100
```

Demo value: **68%** (static).

### Peak Shaving

```
Peak Shaved (kW) = Peak Grid Demand (without BESS) - Actual Grid Peak (with BESS)
```

Demo value: **2.4 kW** per day (static). The BESS discharges during high-demand periods to flatten the grid import curve.

---

## 6. Solar Generation Metrics

**Source:** `src/pages/SolarPage.jsx`, `src/pages/DashboardPage.jsx`

### Cost Savings from Solar

```
Monthly Solar Savings (₹) = Solar Generated (kWh) × Grid Rate (₹/kWh)
```

At ₹12/kWh grid rate:
```
Jan: 245 kWh × ₹12 = ₹2,940
Feb: 263 kWh × ₹12 = ₹3,156
Mar: 238 kWh × ₹12 = ₹2,856
Apr: 287 kWh × ₹12 = ₹3,444
May: 272 kWh × ₹12 = ₹3,264
Jun: 312 kWh × ₹12 = ₹3,744
```

### Solar Panel Specs (demo system)

```
Installed Capacity  =  12 kWp
Panel Count         =  48 panels
Panel Efficiency    =  21.4%
```

### Chart Bar Height Normalization (SolarPage)

```
Bar Height (%) = (hourly_generation / 7) × 100
```

7 kW is treated as the reference peak output for the installed 12 kWp system.

---

## 7. BESS / Battery Metrics

**Source:** `src/pages/BatteryHealthPage.jsx`, `src/pages/TowerAdmin/TowerAdminBESS.jsx`, `src/pages/CompanyAdmin/CompanyAdminBESS.jsx`, `src/components/BatteryGauge.jsx`

### System Constants (Tower A BESS unit)

```
Pack Voltage        =  48 V
Pack Capacity       =  200 Ah  →  9.6 kWh usable
Cell Count          =  16 cells
Module Count        =  4 modules (4 cells each)
Nominal Cell Voltage = 3.65 V
```

### Cell Simulation Ranges

| Metric | Range | Warning Threshold |
|---|---|---|
| Cell Voltage | 3.575 – 3.725 V | < 3.4 V or > 3.8 V |
| Cell Temperature | 28 – 36 °C | > 35 °C |
| Cell SOC | 65 – 85 % | < 20 % |
| Cell Health | 90 – 100 % | < 80 % |

### Aggregate BESS Metrics

```
Average Cell Temperature  = SUM(all cell temps)    / cell_count
Average Cell Voltage      = SUM(all cell voltages) / cell_count
Minimum Cell Health       = MIN(all cell health values)
```

### State of Health (SoH)

```
SoH (%)  =  (Current Usable Capacity / Original Rated Capacity) × 100
```

Demo value: **96.8%** (static, simulating a relatively new battery).

### Battery Gauge Fill (BatteryGauge component)

```
Arc Fill  =  (SOC / 100) × circumference
          where circumference = 2π × radius

Stroke Offset = circumference - Arc Fill
```

Color coding:
```
SOC < 20%   → Red    (#ef4444)
SOC < 50%   → Amber  (#f59e0b)
SOC ≥ 50%   → Green  (#22c55e)
```

### BESS Fleet Health Classification

| SoH | Status | Color |
|---|---|---|
| ≥ 95% | Healthy | Green |
| 80–94% | Degraded | Amber |
| < 80% | Critical | Red |

### Company Admin BESS Thresholds (configurable in Settings)

| Parameter | Warning | Critical |
|---|---|---|
| State of Health | 80% | 60% |
| Cell Temperature | 45 °C | 55 °C |
| Charge Level (low) | 20% | — |
| Charge Level (high) | 95% | — |

---

## 8. CO₂ & Carbon Offset

**Source:** `src/components/CarbonCard.jsx`, `src/pages/DashboardPage.jsx`, `src/pages/AdminDashboard.jsx`

### CO₂ Offset Calculation

```
CO₂ Saved (kg) = Energy Displaced from Grid (kWh) × CO₂ Emission Factor (kg/kWh)
```

India grid emission factor: **~0.82 kg CO₂/kWh** (CEA 2023 average).

Demo values used in the portal (static):

| Metric | Value | Source |
|---|---|---|
| CO₂ Saved (monthly) | 2,847 kg | CarbonCard / Resident Dashboard |
| Trees Equivalent | 142 trees | CarbonCard |
| Coal Avoided | 1,250 kg | CarbonCard |
| Grid Independence | 68% | CarbonCard |
| CO₂ Offset (Admin) | 1,247 kg | AdminDashboard |

### Trees Equivalent

```
Trees Equivalent = CO₂ Saved (kg) / 20 kg
```
(1 mature tree absorbs ~20 kg CO₂/year — rough estimate.)

```
2,847 / 20 = ~142 trees  ✓  (matches CarbonCard value)
```

### Coal Avoided

```
Coal Avoided (kg) = CO₂ Saved (kg) / ~2.28
```
(Burning 1 kg coal produces ~2.28 kg CO₂.)

```
2,847 / 2.28 ≈ 1,249 kg  ≈  1,250 kg  ✓  (matches CarbonCard value)
```

---

## 9. Currency System

**Source:** `src/context/CurrencyContext.jsx`

### Supported Currencies

| Code | Country | Symbol | Dial Code | Phone Max Digits |
|---|---|---|---|---|
| IN | India | ₹ | +91 | 10 |
| KE | Kenya | KSh | +254 | 9 |
| US | USA | $ | +1 | 10 |
| GB | UK | £ | +44 | 10 |
| AE | UAE | AED | +971 | 9 |
| NG | Nigeria | ₦ | +234 | 10 |
| ZA | South Africa | R | +27 | 9 |
| AU | Australia | A$ | +61 | 9 |
| SG | Singapore | S$ | +65 | 8 |
| BD | Bangladesh | ৳ | +880 | 11 |

### Currency Switching

The selected currency symbol is prepended to all monetary values throughout the app.
The underlying numbers are **not converted** — they remain INR-denominated.

```
Display Value = symbol + raw_number
```

> ⚠️ **Known limitation:** Currency switching is cosmetic only.
> Real exchange rate conversion is not implemented.
> All figures are INR-based regardless of selected region.

### Persistence

```
localStorage key:  'bess_country'
Default:           'IN'
```

---

## 10. Alert & Status Thresholds

### Wallet Alerts

| Threshold | Action |
|---|---|
| Balance < ₹1,000 | Critical alert (red) |
| Balance < ₹3,000 | Low balance warning (amber) |
| Balance < ₹5,000 | "Add Now" nudge shown |

### BESS Temperature Alerts

| Temperature | Status |
|---|---|
| > 55 °C | Critical — immediate action |
| > 45 °C | Warning — monitor closely |
| > 35 °C | Cell-level warning flag |
| ≤ 35 °C | Normal |

### BESS State of Charge Alerts

| SOC | Alert |
|---|---|
| < 20% | Low charge alert |
| > 95% | Overcharge alert |
| 20–95% | Normal operation |

### Collection Rate Alerts

| Rate | Status |
|---|---|
| ≥ 95% | Healthy (green) |
| 90–94% | Monitor (amber) |
| < 90% | Attention required (red) |

### BESS SOC Gauge Colors

| SOC | Color |
|---|---|
| < 20% | Red |
| 20–49% | Amber |
| ≥ 50% | Green |

---

## 11. Known Inconsistencies & TODOs

These are existing gaps in the demo data that should be addressed when connecting a real backend.

| # | Issue | Location | Fix |
|---|---|---|---|
| 1 | **DG rate mismatch** | InvoicesPage uses ₹45/kWh; WalletPage transaction `18.8 kWh = ₹225.60` implies ₹12/kWh | Standardise DG rate to ₹45/kWh in WalletPage |
| 2 | **Dual collection rate formulas** | CompanyAdminBilling uses `collected/generated`; CompanyAdminPayments uses `collected/(collected+pending)` | Pick one formula and apply consistently |
| 3 | **CO₂ values differ by dashboard** | Resident sees 2,847 kg; Admin sees 1,247 kg for the same month | Align on one source of truth |
| 4 | **Currency is cosmetic only** | No exchange rate conversion — ₹3,250 displayed as $3,250 when USD selected | Add exchange rate API or document this as INR-only |
| 5 | **No late fee computation** | Overdue status is tracked but late fee (5%) is never added to the bill | Implement: `Late Fee = Outstanding Amount × 0.05` |
| 6 | **No dynamic billing engine** | All bill amounts are hardcoded mock data | Real implementation: `Bill = (mains_kWh × rate) + (dg_kWh × dg_rate) + fixed_charge`, then apply GST |
| 7 | **Simple average for collection rate** | `avgCollection = sum(rates) / count` — skewed by small societies | Use revenue-weighted average: `sum(collected) / sum(generated) × 100` |
| 8 | **SoH is static** | Always 96.8% regardless of cycle count | Real formula: `SoH = (Q_measured / Q_rated) × 100`, degrade over cycles |

---

## Quick Reference Card

```
Invoice Total    =  (mainsKWh × 12) + (dgKWh × 45) + 250) × 1.18
Collection Rate  =  (collected / generated) × 100
New Balance      =  currentBalance + rechargeAmount
Net Power        =  solarGen − loadDemand
BESS Action      =  charge if net > 0,  discharge if net < 0
Solar Savings    =  solarKWh × gridRate  (₹12/kWh)
CO₂ Saved        =  gridKWh displaced × 0.82 kg/kWh
Trees Equivalent =  co2Saved_kg / 20
Balance Fill %   =  MIN(100, walletBalance / 5000 × 100)
```
