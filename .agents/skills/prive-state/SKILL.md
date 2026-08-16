---
name: prive-state
description: >
  Complete reference for the Privé global state store — State shape,
  all dispatch actions, derived data fields, and data types. Use this skill
  before reading or writing any state to avoid naming mismatches.
---

# Privé State Store Reference

**File:** `src/lib/prive/store.tsx`  
**Hook:** `usePrive()` — available in any `"use client"` page/component

```ts
const { state, derived: d, dispatch } = usePrive();
```

---

## State Shape (`state.*`)

Raw mutable state — updated by dispatch actions.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `persona` | `Persona` | `"gm"` | Current view persona |
| `regionalRestaurantId` | `string` | `GM_RESTAURANT_ID` | Selected store in regional/GM view |
| `shiftAccepted` | `boolean` | `false` | Maya accepted open shift |
| `extraStaffApproved` | `number` | `0` | How many extra staff GM approved |
| `potatoOrderIncrease` | `number` | `0` | Extra lbs ordered / transferred |
| `transferRequested` | `boolean` | `false` | Cross-store transfer initiated |
| `certificationCompleted` | `boolean` | `false` | ServSafe cert renewed |
| `mayaTrainingComplete` | `boolean` | `false` | Maya's allergen training done |
| `i9Complete` | `boolean` | `false` | Maya's I-9 verified |
| `complaints` | `Complaint[]` | seed data | All guest complaints (all stores) |
| `giftCredits` | `GiftCredit[]` | `[]` | Issued recovery credits |
| `audit` | `AuditEvent[]` | 2 seed entries | Full audit trail |
| `scenarioUplift` | `number` | `0` | What-if traffic % (executive scenario) |
| `tomorrowUplift` | `number` | `18` | Forecast baseline uplift % |
| `shiftOfferSent` | `boolean` | `false` | GM broadcast open-shift offer |
| `separationDecision` | `string \| null` | `null` | "Retain" \| "Proceed" \| null |
| `acknowledged` | `string[]` | `[]` | IDs of acknowledged notifications |
| `dismissedAlerts` | `string[]` | `[]` | IDs of dismissed operational alerts |
| `gmReviewAssigned` | `boolean` | `false` | GM assigned to review guest case |
| `avocadoOrderIncreased` | `boolean` | `false` | Avocado surplus order approved |
| `w2AddressVerified` | `boolean` | `false` | W-2 address confirmed |
| `pendingQuestion` | `string \| null` | `null` | Pre-fills Ask Privé drawer |
| `expandedSections` | `Record<string, boolean>` | `{"/gm/home": true}` | Sidebar section open state |

---

## All Dispatch Actions

```ts
// Persona
dispatch({ type: "persona", persona: "gm" | "employee" | "regional" | "executive" | "guest" });

// Regional store selection (triggers derived recalculation for that store)
dispatch({ type: "regionalRestaurant", id: "restaurant-id" });

// Staffing
dispatch({ type: "sendShiftOffer" });           // GM broadcasts open shift
dispatch({ type: "acceptShift" });              // Employee accepts (Maya's button)
dispatch({ type: "approveStaffing" });          // GM formally approves new staff

// Inventory
dispatch({ type: "increasePotatoOrder", lbs: 35 });  // Order more from supplier
dispatch({ type: "transferInventory", lbs: 35 });    // Cross-store transfer
dispatch({ type: "increaseAvocadoOrder" });           // Avocado surplus

// Compliance
dispatch({ type: "completeCertification" });    // ServSafe renewal
dispatch({ type: "completeTraining" });         // Maya's allergen training
dispatch({ type: "completeI9" });              // I-9 verification

// Guest complaints
dispatch({ type: "resolveComplaint", id: "c-1", amount: 25 });   // Approve + issue credit
dispatch({ type: "rejectComplaint", id: "c-1" });                 // Reject complaint
dispatch({ type: "escalateComplaint", id: "c-1" });               // Escalate to regional
dispatch({ type: "createComplaint", complaint: { ... } });         // Voice AI intake

// Recovery credits
dispatch({ type: "redeemCredit", code: "MT-XXXX-YYYY-ZZZZ-01" }); // Guest redeem

// Executive what-if scenario
dispatch({ type: "scenario", uplift: 15 });    // Set traffic uplift % (0–50)

// Workforce
dispatch({ type: "separation", decision: "Retain" | "Proceed" });
dispatch({ type: "assignGmReview" });
dispatch({ type: "verifyW2Address" });

// Notifications
dispatch({ type: "acknowledge", id: "notif-id", title: "Title" });
dispatch({ type: "dismissAlert", id: "alert-id" });

// Ask Privé
dispatch({ type: "askPriveTrigger", question: "Can we handle tomorrow?" });
dispatch({ type: "clearPendingQuestion" });

// Sidebar
dispatch({ type: "toggleSidebarSection", href: "/gm/staffing", open: true });

// Manual audit entry (advanced — prefer specific actions above)
dispatch({
  type: "audit",
  event: {
    actor: "Jordan Ellis (GM)",
    agent: "Scheduling Agent",
    action: "Approved staffing adjustment",
    detail: "Saturday 4:00–8:00 PM · +1 server",
    approval: "Manager approved",
  }
});

// Demo utilities
dispatch({ type: "resetDemo" });   // Full state reset to initialState
dispatch({ type: "hydrate", state: { persona: "executive" } }); // Partial state merge
```

---

## Derived Data (`derived.*` / `d.*`)

Computed every render from `state`. Never modify these directly.

### Store / GM scope (Ballantyne #02)

```ts
d.readiness            // { score: number, risks: ReadinessRisk[], label: string }
d.readiness.score      // 0–100 — composite readiness % for tomorrow
d.readiness.risks      // [ { label, detail, probability } ]

d.potato               // { onHand, shortage, depletesByDate }
d.potato.shortage      // lbs below par level after state.potatoOrderIncrease applied

d.staffing             // { gap, coverage, scheduledStaff, neededStaff, projectedLaborPct, ... }
d.staffing.gap         // integer — how many roles short for peak

d.tomorrow             // { sales, transactions, vsTypicalPct, forecastConfidence, laborCost }
d.tomorrow.sales       // predicted revenue
d.tomorrow.vsTypicalPct // e.g. 18 → "+18% vs typical"

d.gmComplaints         // Complaint[] — only for Ballantyne #02, current state
d.awaitingApproval     // number — complaints awaiting GM sign-off
d.complaintForecast    // { expected, ratePer1000 }

d.workforce            // { total, active, onboarding, onLeave, openRoles, certExpiring, ... }
d.alerts               // OperationalAlert[] — non-dismissed alerts for GM

d.inventory            // InventoryItem[] — with depletion projections
d.depletion            // InventoryDepletion[] — items at risk
```

### Regional / Cross-store scope

```ts
d.health               // Array<{ restaurant: Restaurant, score: number, state: HealthState }>
                       // All 12 stores — sorted by restaurantById order
d.selectedHealth       // { restaurant, score, state, reasons } — currently selected store
d.supplyChain          // { atRisk: DepletioonSku[], transferable: ... }
```

### Executive scope

```ts
d.enterprise           // { monthRevenue, sameStoreSalesPct, laborPct, ... }
d.enterprise.monthRevenue   // total 12-store MTD revenue
d.enterprise.laborPct       // avg labor % across 12 stores
d.enterprise.marginDelta    // EBITDA vs plan (negative = behind)
d.enterprise.recoverySpend  // total gift credits issued MTD
d.enterprise.sentiment      // 0–5 guest satisfaction score
d.enterprise.atRiskStores   // number of stores in "Action Required"

d.scenario             // { upliftPct, revenueDelta, revenueTotal, transactionDelta,
                       //   laborHoursDelta, extraStaffNeeded, inventoryExposureSkus,
                       //   serviceRiskPct }
```

### Employee scope (Maya Robinson)

```ts
d.maya                 // Employee — Maya Robinson's data from employeesFor(rid)
d.shifts               // Shift[] — Maya's upcoming shifts
d.knowledge            // KnowledgeEntry[] — policy FAQ items
```

### Common

```ts
d.pendingApprovals     // Array<{ id, label, done }> — for readiness score calc
d.giftCredits          // GiftCredit[] — same as state.giftCredits
d.audit                // AuditEvent[] — same as state.audit (newest first)
d.persona              // Persona — current view
```

---

## Key Data Types

```ts
// From src/lib/prive/data.ts
type HealthState = "Healthy" | "Watch" | "Action Required" | "Critical";
type Persona = "gm" | "employee" | "regional" | "executive" | "guest";

interface Restaurant {
  id: string; name: string; city: string;
  ownership: "Corporate" | "Franchise";
  volume: "High" | "Average" | "Low";
  openHour: number; closeHour: number;
  baseSales: number; avgTicket: number;
  targetLaborPct: number; minStaff: number;
  turnoverDelta: number; complaintDelta: number;
  laborDelta: number;
}

interface Employee {
  id: string; name: string; restaurantId: string;
  role: string; status: "Active" | "Onboarding" | "Leave" | "Inactive";
  tenureMonths: number; scheduledHours: number; workedHours: number;
  wage: number; attendanceExceptions: number;
  trainingOverdue: boolean;
  certExpiresInDays: number | null;
  daysSinceLastShift: number;
}

interface Complaint {
  id: string; guestName: string; restaurantId: string;
  type: string; description: string; draftResponse: string;
  recommendedCredit: number; status: "Awaiting Approval" | "Resolved" | "Rejected" | "Escalated";
  source: "Voice AI" | "Email" | "Online Review" | "In-Person";
  receivedAt: string; priority: "High" | "Medium" | "Low";
}

interface GiftCredit {
  code: string; amount: number; complaintId: string;
  customer: string; issuedBy: string; issuedAt: string;
  expires: string; restaurantId: string;
  singleUse: boolean; redeemed: boolean;
}

interface AuditEvent {
  id: string; at: string; actor: string; agent: string;
  action: string; detail: string;
  approval: "Manager approved" | "Automatic (low risk)" | "Pending";
}
```

---

## Named Constants (from `src/lib/prive/data.ts`)

```ts
GM_RESTAURANT_ID        // ID of Ballantyne #02 (GM's home store)
TROUBLED_RESTAURANT_ID  // Charlotte #03 (primary at-risk store)
MAYA                    // Employee — Maya Robinson (employee persona)
CERT_EMPLOYEE           // Employee — Andre Vega (ServSafe renewal demo)
JORDAN_SEPARATION       // Employee — Jordan Smith (45 days inactive)
TODAY                   // Date string for today's forecast
TOMORROW                // Date string for tomorrow's forecast
```

---

## Money Formatting Helper

```ts
// Available in many pages via local definition — replicate as needed
function moneyShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
```
