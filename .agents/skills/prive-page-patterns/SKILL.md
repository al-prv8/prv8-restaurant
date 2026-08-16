---
name: prive-page-patterns
description: >
  Standard page structure patterns, shell architecture, persona routing,
  and layout conventions for the Privé Restaurant Intelligence project.
  Use this skill when creating a new page or persona module.
---

# Privé Page Architecture Patterns

## Shell Architecture

There are **two shells** in this project. Pick the right one:

| Shell | Path | Used By | Background | Nav |
|-------|------|---------|-----------|-----|
| `PriveShell` | `src/components/prive/Shell.tsx` | GM, Employee, Regional, Executive, Integrations | `#F7F5F2` cream | Dark charcoal TopNav |
| `GuestShell` | `src/components/prive/GuestShell.tsx` | Guest Service & Credits | `#FFFEF9` warm white | Light white nav |

### PriveShell usage

Layouts wrap their route with `PriveShell`. Module pages do NOT re-wrap.

```tsx
// app/gm/layout.tsx — layout file
import { PriveShell } from "@/components/prive/Shell";

export default function GmLayout({ children }: { children: React.ReactNode }) {
  return <PriveShell persona="gm">{children}</PriveShell>;
}
```

```tsx
// app/gm/staffing/page.tsx — module page (no shell)
"use client";
export default function GmStaffingPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">
          Labor Management
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
          Staffing & Labor
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
          Coverage, gaps, and labor cost vs forecast for Ballantyne #02.
        </p>
      </div>
      {/* ... page content */}
    </>
  );
}
```

### Valid persona values

```ts
type Persona = "gm" | "employee" | "regional" | "executive" | "guest";
```

---

## Standard Page Header Pattern

Every module page starts with this exact structure:

```tsx
<div className="mb-8">
  {/* Optional eyebrow — always brand crimson, always uppercase */}
  <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">
    Labor Management
  </p>

  {/* H1 — one per page */}
  <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
    Staffing & Labor
  </h1>

  {/* Subtitle — max 3xl, stone color */}
  <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
    Coverage, gaps, and labor cost vs forecast for Ballantyne #02.
  </p>
</div>
```

Optional: add a right-aligned action button:

```tsx
<div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h1 ...>Page Title</h1>
    <p ...>Subtitle</p>
  </div>
  <Button variant="ghost" onClick={handleExport}>
    <Download className="size-4 mr-2" /> Export
  </Button>
</div>
```

---

## Standard Page Body Structure

```tsx
{/* 1. Operations Brief (optional but recommended on complex pages) */}
<PriveIntelBanner summary="..." details={[...]} />

{/* 2. KPI Strip */}
<KpiRow items={[...]} />

{/* 3. Tab filter (optional) */}
<PageTabs tabs={[...]} active={tab} onChange={setTab} />

{/* 4. Main content grid */}
<div className="grid gap-6 lg:grid-cols-12">
  <div className="lg:col-span-7 space-y-6">
    <Card>...</Card>
  </div>
  <div className="lg:col-span-5 space-y-6">
    <Card>...</Card>
  </div>
</div>
```

---

## Persona Routing Map

| Persona | Layout | Modules |
|---------|--------|---------|
| GM | `app/gm/layout.tsx` | home · staffing · inventory · guests · workforce · facility · communications · approvals |
| Employee | `app/employee/layout.tsx` | home · training · schedule · announcements |
| Regional | `app/regional/layout.tsx` | portfolio · intelligence · supply-chain |
| Executive | `app/executive/layout.tsx` | pulse · scenario · portfolio |
| Guest | `app/guest/layout.tsx` | service · credits |

Redirect pattern (index routes):
```tsx
// app/gm/page.tsx
import { redirect } from "next/navigation";
export default function GmIndex() {
  redirect("/gm/home");
}
```

---

## State Access Pattern

All pages use the `usePrive` hook. State is global and persists across navigation.

```tsx
"use client";
import { usePrive } from "@/lib/prive/store";

export default function MyPage() {
  const { state, derived: d, dispatch } = usePrive();

  // Raw state (user actions, flags)
  state.certificationCompleted    // boolean
  state.separationDecision        // "Retain" | "Proceed" | null
  state.staffingApproved          // boolean

  // Derived (computed from state, recalculates reactively)
  d.readiness.score               // number 0–100
  d.staffing.gap                  // number
  d.potato.shortage               // number (lbs)
  d.gmComplaints                  // array
  d.alerts                        // array
  d.health                        // array of {restaurant, score, state}
  d.enterprise.monthRevenue       // number

  // Dispatch actions
  dispatch({ type: "resolveComplaint", id: "123", amount: 25 });
  dispatch({ type: "approveStaffing" });
  dispatch({ type: "increasePotatoOrder", lbs: 35 });
  dispatch({ type: "separation", decision: "Retain" });
  dispatch({ type: "certificationCompleted" });
  dispatch({ type: "dismissAlert", id: "alert-1" });
  dispatch({ type: "regionalRestaurant", id: "store-id" });
  dispatch({ type: "trafficChange", pct: 15 });
  dispatch({ type: "resetDemo" });
  dispatch({ type: "askPriveTrigger", question: "Can we handle tomorrow?" });
}
```

---

## Ask Privé Integration

**Drawer** (available on all non-guest pages via TopNav button — no code needed in pages):
- Clicking "Ask Privé" in the TopNav opens the global drawer
- `dispatch({ type: "askPriveTrigger", question: "..." })` also opens the drawer with a pre-filled question

**Inline console** (embed Ask Privé directly in a page):
```tsx
import { AskPriveConsole } from "@/components/prive/AskPrive";

// Full width (regional intelligence page)
<AskPriveConsole persona="regional" />

// Compact (inside a card)
<AskPriveConsole persona="employee" compact />
```

**Quick-action chip** (link a button to open the drawer with a question):
```tsx
<button
  onClick={() => dispatch({ type: "askPriveTrigger", question: "Why is labor above forecast?" })}
  className="flex items-center gap-2 rounded-xl border border-[#881337]/20 bg-[#881337]/5 px-3 py-2.5 text-left text-[13px] font-bold text-[#881337] transition-colors hover:bg-[#881337]/10"
>
  <span className="opacity-70">✦</span>
  Ask Privé: "Why is labor above forecast?"
</button>
```

---

## Subheader Context Strip (auto-managed by Shell)

The dark subheader below the TopNav shows:
- Left: persona label (e.g., "General Manager · Ballantyne #02")
- Right (GM only): readiness score with color coding

This is rendered by `Shell.tsx` — pages do not need to add it.

---

## Common Anti-Patterns to Avoid

```tsx
// ❌ Wrapping a module page in PriveShell (layout already does this)
export default function GmHomePage() {
  return <PriveShell persona="gm"><div>...</div></PriveShell>;
}

// ✅ Correct
export default function GmHomePage() {
  return <><div className="mb-8">...</div>...</>;
}

// ❌ Using AskPriveDrawer directly in a page
import { AskPriveDrawer } from "@/components/prive/AskPrive";
// AskPriveDrawer is only used in Shell.tsx

// ❌ Importing from wrong path
import { Card } from "@/components/Card";          // wrong
import { Card } from "@/components/prive/ui";      // correct
```
