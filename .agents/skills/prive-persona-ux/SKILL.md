---
name: prive-persona-ux
description: >
  Per-persona UX rules, writing tone, layout constraints, and interaction
  patterns for all 5 Privé personas: GM, Employee, Regional Director,
  C-Suite Executive, and Guest. Use this skill when building any new page
  or feature for a specific persona.
---

# Privé Persona UX Rules

Each persona has a **distinct character** — not just a different nav. The interaction density, tone, information hierarchy, and visual weight all differ.

---

## GM — Jordan Ellis, General Manager

**Shell:** `PriveShell persona="gm"`  
**Routes:** `/gm/home` · `/gm/staffing` · `/gm/inventory` · `/gm/guests` · `/gm/workforce` · `/gm/facility` · `/gm/communications` · `/gm/approvals`

### Character

> "I have 12 minutes before the lunch rush. Tell me what needs my attention."

- Time-pressured, mobile-aware, action-first
- Wants to know **what happened**, **what Privé recommends**, and **where to sign off**
- Does not want to see data without a recommended action

### Rules

1. **Kitchen hero image** on `/gm/home` — grounds the digital in the physical operation
2. **Time-aware greeting**: `Good morning/afternoon/evening, Jordan.` + store name + date
3. **1-Click Action chips** on home page — resolve top priorities in one tap
4. **Every complaint/recommendation has 3 options**: Approve / Edit / Reject (never auto-execute)
5. **Attribution stamp** always appears after approval: `✓ Approved by Jordan Ellis · 4:32 PM`
6. **Readiness gauge** on home — 0–100 score, animated radial, with risk list below
7. **Batch approval toolbar** when multiple items await — total credit amount shown before approve

### Information Hierarchy on Home Page

```
1. Kitchen hero / location identity
2. Intel Banner (most urgent single-line summary)
3. 1-Click action chips (top priority items)
4. KPI strip (Sales · Labor % · Staffing · Complaints · Inventory Risk)
5. Tabs: Overview | Readiness | Alerts
6. Main content: Readiness gauge + Morning Brief
7. Alert grid (lowest — dismissible)
```

### Writing Tone (GM)

| ❌ Don't | ✅ Do |
|----------|-------|
| "The AI has detected a potential shortfall" | "Potato shortage — order +35 lbs before 5 PM cutoff" |
| "Predictive analytics indicate..." | "Saturday peak: 2 roles short. Send shift offer?" |
| "Our system recommends..." | "Privé recommendation: $25 credit · 94% confidence" |
| "Processing your request..." | "Approved & logged to audit trail." |

---

## Employee — Maya Robinson, Front of House

**Shell:** `PriveShell persona="employee"`  
**Routes:** `/employee/home` · `/employee/training` · `/employee/schedule` · `/employee/announcements`

### Character

> "What's my shift? What do I need to finish before I come in?"

- Mobile-first: compact, single-column on small screens
- No financial data, no complaint details, no regional scores
- Wants warmth and simplicity — not enterprise density

### Rules

1. **Warm greeting**: `Good morning, Maya.` + `Your day at Ballantyne #02.`
2. **Shift card is the hero** on home — time block (10 AM–4 PM), section assignment, hours this week
3. **No dark analytics** — no complaint counts, no readiness scores, no labor %
4. **Training presented as task cards** — single module, estimated time (5 min), clear CTA
5. **Open shifts are opportunity** — frame positively (`+$XX for 4 hrs` not `coverage gap`)
6. **Policy accordion** — knowledge base answers without needing a manager
7. **Ask Privé inline console** on announcements page — employee-scoped questions only

### Layout Constraint

```
max-w-2xl mx-auto  ← all employee pages are narrower than GM/Regional
```

### Writing Tone (Employee)

| ❌ Don't | ✅ Do |
|----------|-------|
| "Your labor compliance score is 72%" | "Training due: Allergen Awareness (5 min)" |
| "Staffing gap detected for Saturday" | "Open shift — Sat 4–8 PM. Pick it up?" |
| "System alert: certification expiry" | "Your ServSafe renews in 14 days — schedule it now" |

---

## Regional Director — Dana Whitmore

**Shell:** `PriveShell persona="regional"`  
**Routes:** `/regional/portfolio` · `/regional/intelligence` · `/regional/supply-chain`

### Character

> "Show me which stores need my attention this week and why."

- Portfolio view — **12 stores at once**, not one
- Wants patterns and variance, not individual transaction detail
- Drill-in for root cause, not action buttons (that's the GM's job)

### Rules

1. **Cross-location comparison chart first** — all 12 bars ranked before the table
2. **Health matrix**: full 12-location table — Health Score | Status | Labor Δ | Turnover Δ
3. **Clickable rows** — selecting a store populates the Store Analysis panel
4. **Root cause panel** — 3–5 bullet reasons why this store is lagging (not just scores)
5. **Side-by-side comparison HUD** — Store A vs Store B picker
6. **Dual Store HUD badge** — `<Pill tone="teal">Dual Store HUD</Pill>`
7. **Intelligence page** — full-width `<AskPriveConsole persona="regional" />` for natural language queries
8. **Supply chain page** — cross-location inventory risk, transfer opportunities

### Information Hierarchy

```
1. Portfolio header (12 locations · health count badges)
2. Cross-location readiness bar chart (ALL 12, ranked)
3. Tab filter: All | Healthy | Action/Watch
4. Health matrix table (paginated, sortable)
5. Side panel: Selected store analysis + root causes
6. Dual store comparison HUD
```

### Writing Tone (Regional)

| ❌ Don't | ✅ Do |
|----------|-------|
| "Location #03 has issues" | "Charlotte #03 — Action Required · 3.2 pt labor delta · turnover +18%" |
| "The AI found cross-location patterns" | "Carolinas Pattern: 4 stores spiking complaint volume after 7 PM" |
| "Data analysis complete" | "Root cause: split shift scheduling + 2 open server roles unresolved since Monday" |

---

## C-Suite Executive — Ellis Rourke

**Shell:** `PriveShell persona="executive"`  
**Routes:** `/executive/pulse` · `/executive/scenario` · `/executive/portfolio`

### Character

> "Revenue, margin, same-store growth — and what's the forward outlook?"

- Financial framing only — revenue, EBITDA, margin delta, labor %, recovery spend
- **No operational detail** (no specific complaints, no individual employee names)
- Wants the story in one number + one sentence, then the drill-down

### Rules

1. **KPI header**: Month Revenue · EBITDA Margin · Same-Store Sales % · Enterprise Labor % · Recovery Spend · At-Risk Stores
2. **Financial waterfall**: Gross Revenue → Food & COGS → Direct Labor → Guest Recovery → Net EBITDA
3. **"What Privé Anticipates"** narrative block — 2–3 sentences of forward outlook
4. **Guest sentiment trend chart** — 8-week line, green/red auto-color by direction
5. **What-If Scenario Engine** — traffic % slider, real-time recalculation of 4 metrics
6. **Portfolio health table** — all 12 locations ranked by composite score
7. No approval buttons — executive views are read-only intelligence

### Financial Display Format

```tsx
// Revenue: always use moneyShort()
$1.2M  ← monthRevenue
$31K   ← dailySales

// Percentages: always 1 decimal
24.8%  ← laborPct

// Deltas: always show sign
+3.2%  ← positive same-store sales
-1.2 pts  ← EBITDA margin behind plan
```

### Writing Tone (Executive)

| ❌ Don't | ✅ Do |
|----------|-------|
| "Compliance issues detected at 3 locations" | "2 stores requiring immediate intervention — Charlotte #03, Raleigh #07" |
| "The AI model predicts..." | "Privé anticipates EBITDA normalization if overtime stabilizes by week 3" |
| "Click here to learn more" | No CTAs — executive view is read-only intelligence |

---

## Guest — Anonymized

**Shell:** `GuestShell` (NOT `PriveShell`)  
**Routes:** `/guest/service` · `/guest/credits`

### Character

> "Something went wrong at dinner. I want to feel heard and get a resolution."

- **Consumer-grade** aesthetic — not enterprise
- Warm, personal, low information density
- Maximum `max-w-2xl mx-auto` centered column

### Shell Differences (`GuestShell`)

| Feature | PriveShell (Enterprise) | GuestShell (Consumer) |
|---------|------------------------|----------------------|
| Background | `#F7F5F2` cream | `#FFFEF9` warm white |
| Nav | `bg-[#1C1917]` dark charcoal | `bg-white border-b border-[#F3F2F0]` light |
| Nav text | White | `text-[#1C1917]` |
| Logo accent | White "P" on crimson | White "P" on crimson (same) |
| Content width | Full `max-w-7xl` | `max-w-2xl` centered |
| Tab bar | TopNav nav links | Inline `Contact \| Credits` tabs |

### Rules

1. **No enterprise language** — no "operational signals", no "portfolio health", no "readiness score"
2. **Voice AI call card** — phone number, "Available 24/7", what to say
3. **Case status tracker** — simple status pill: Under Review · Response Sent · Resolved
4. **Recovery credits**: `"Your Recovery Credits — no expiry, no catch"`
5. **Redeem button** only — no approval workflow (credits are already approved by GM on the backend)
6. **"Held for manager approval"** — always visible disclaimer on voice intake card

### Writing Tone (Guest)

| ❌ Don't | ✅ Do |
|----------|-------|
| "Complaint intake initiated" | "We're sorry about your experience. Here's what happens next." |
| "Recovery credit issued via HITL workflow" | "A $25 gift credit has been added to your account." |
| "GM approval pending" | "A manager is reviewing your case — typically same-day." |
| "Credit validation token generated" | "Single-use credit · valid at all Carolinas locations" |

---

## Shared Cross-Persona Rules

| Rule | All Personas |
|------|-------------|
| Ask Privé trigger | Available in TopNav for all non-guest personas |
| "AI" word | Never use in UI text. Use "Privé", "Intelligence", "Operational" |
| Empty states | Always show a message — never a blank void |
| Loading states | Use `PageSkeleton` or `CardSkeleton` from `ui.tsx` |
| Audit trail | Every GM action dispatch logs to `state.audit` automatically |
| Mobile | Grids collapse to single-column on `sm` breakpoint |
| Page width | `max-w-7xl` for GM/Regional/Executive, `max-w-2xl` for Guest/Employee |
