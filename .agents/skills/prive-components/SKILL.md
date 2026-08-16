---
name: prive-components
description: >
  Complete API reference for every component exported from
  src/components/prive/ui.tsx. Use this skill when building or editing any
  page in the Privé project to ensure correct component usage and avoid
  prop mismatches.
---

# Privé Component Library

**Single source of truth:** `src/components/prive/ui.tsx`  
**Import path:** `@/components/prive/ui`

---

## Card

Container for all page sections. Always use `<Card>` instead of raw `<div>` for bordered content blocks.

```tsx
import { Card } from "@/components/prive/ui";

// Default — white bg, #E7E5E0 border
<Card>...</Card>

// Intel tone — white bg, subtle crimson border (use for Privé recommendations)
<Card tone="intel">...</Card>

// Alert tone — white bg, red border (use for critical warnings)
<Card tone="alert">...</Card>

// With custom className
<Card className="h-full">...</Card>
```

**Props:** `tone?: "default" | "intel" | "alert"` · `className?: string`

---

## SectionTitle

Standard section header inside a Card. Always placed immediately after `<Card>` opens.

```tsx
import { SectionTitle } from "@/components/prive/ui";

<SectionTitle>Staffing Coverage</SectionTitle>
<SectionTitle hint="Last 7 days">Complaint Trend</SectionTitle>
<SectionTitle hint={`${items.length} active`}>Alert Queue</SectionTitle>
```

**Props:** `hint?: string`  
Renders as `text-[11px] font-bold uppercase tracking-[0.15em] text-[#A8A29E]` with a right-aligned `hint` badge.

---

## KpiRow

Horizontal strip of KPI metrics. Renders a divided grid — columns auto-sized to item count.

```tsx
import { KpiRow } from "@/components/prive/ui";

<KpiRow
  items={[
    { label: "Open Complaints", value: 3, tone: "bad" },
    { label: "Awaiting Approval", value: 1, tone: "warn" },
    { label: "Resolved Today", value: 2, tone: "good" },
    { label: "Recovery Spend", value: "$45", valueColor: "text-[#881337]" },
  ]}
/>
```

**Item props:**
| Prop | Type | Notes |
|------|------|-------|
| `label` | `string` | Uppercase micro-label |
| `value` | `string \| number` | Always pass as-is; rendered with `tabular-nums` |
| `sub` / `subtext` | `string` | Optional subline below value |
| `tone` | `"neutral" \| "good" \| "warn" \| "bad" \| "positive" \| "negative"` | Colors the value |
| `valueColor` | `string` | Direct Tailwind class override, e.g. `"text-[#881337]"` |

⚠️ **Never spread an item object directly as props** — `KpiRow` takes an `items` array, not individual props.

---

## Pill

Compact status badge. Use sparingly — not for every label on screen.

```tsx
import { Pill } from "@/components/prive/ui";

<Pill tone="teal">Healthy</Pill>      // green
<Pill tone="amber">Watch</Pill>       // amber
<Pill tone="red">Action Required</Pill>  // red
<Pill tone="neutral">Pending</Pill>   // gray
<Pill tone="indigo">Selected</Pill>   // brand crimson tint
```

**Valid tones:** `"neutral" | "indigo" | "violet" | "teal" | "amber" | "red"`

---

## StatusDot

Inline colored dot for tables and lists.

```tsx
import { StatusDot } from "@/components/prive/ui";

<StatusDot tone="good" />   // green
<StatusDot tone="warn" />   // amber
<StatusDot tone="bad" />    // red
```

**Valid tones:** `"green" | "emerald" | "good" | "amber" | "warn" | "red" | "bad" | "blue" | "gray"`

---

## Button

```tsx
import { Button } from "@/components/prive/ui";

<Button onClick={fn}>Approve</Button>                  // primary (crimson)
<Button variant="ghost" onClick={fn}>Export</Button>   // white border
<Button variant="danger" onClick={fn}>Reject</Button>  // red
<Button variant="quiet" onClick={fn}>Details</Button>  // text-only
<Button disabled>Processing...</Button>
```

**Variants:** `"primary" | "ghost" | "danger" | "quiet" | "violet"` (violet = same as primary)

---

## PageTabs

Underline-style tab bar. Generic over the tab ID type.

```tsx
import { PageTabs } from "@/components/prive/ui";

type Tab = "all" | "pending" | "resolved";
const [active, setActive] = useState<Tab>("all");

<PageTabs
  tabs={[
    { id: "all", label: "All" },
    { id: "pending", label: "Pending", badge: 3 },
    { id: "resolved", label: "Resolved", badge: 0 },
  ]}
  active={active}
  onChange={(id) => setActive(id)}
/>
```

`badge: 0` hides the badge. `badge: undefined` also hides it.

---

## DataTable (two modes)

**Simple mode** (pass `columns` + `data`):
```tsx
import { DataTable } from "@/components/prive/ui";

<DataTable
  columns={["System", "Status", "Last Sync"]}
  data={[
    { System: "Toast POS", Status: <StatusDot tone="good" />, "Last Sync": "43s ago" },
  ]}
/>
```

**Compositional mode** (use `THead`, `Th`, `Tr`, `Td`):
```tsx
import { DataTable, THead, Th, Tr, Td } from "@/components/prive/ui";

<DataTable>
  <THead>
    <Tr>
      <Th>Location</Th>
      <Th>Score</Th>
    </Tr>
  </THead>
  <tbody>
    {rows.map(r => (
      <Tr key={r.id} onClick={() => select(r.id)} selected={r.id === selectedId}>
        <Td className="font-bold">{r.name}</Td>
        <Td>{r.score}</Td>
      </Tr>
    ))}
  </tbody>
</DataTable>
```

`<Tr>` with `onClick` gets `cursor-pointer hover:bg-[#FAFAF8]` automatically.  
`<Tr>` with `selected={true}` gets `bg-[#FFF8F6]` highlight.

---

## PriveIntelBanner

The "Operations Brief" banner. Appears once at the top of a page, below the page header.

```tsx
import { PriveIntelBanner } from "@/components/prive/ui";

<PriveIntelBanner
  summary="3 guest recovery drafts await GM approval."
  details={[
    "Tomorrow projects 4 expected complaints (2.1 per 1k transactions).",
    "All credits use single-use tokens mapped to verified guest emails.",
  ]}
  action={() => handleApproveAll()}
  actionLabel="Approve All"
/>
```

**Props:** `summary: string` · `details?: string[]` · `action?: () => void` · `actionLabel?: string` · `sources?: string[]`

---

## Meter (linear progress bar)

```tsx
import { Meter } from "@/components/prive/ui";

<Meter value={72} tone="amber" />   // 0–100
<Meter value={91} tone="teal" />
```

**Tones:** `"indigo" (crimson) | "teal" | "amber" | "red"`

---

## RadialGauge (circular progress)

```tsx
import { RadialGauge } from "@/components/prive/ui";

<RadialGauge value={d.readiness.score} size={110} strokeWidth={9} />
```

Color auto-sets: ≥85 → green, ≥70 → amber, <70 → red.  
**Props:** `value: number` · `size?: number` · `strokeWidth?: number` · `color?: string`

---

## Sparkline (mini inline trend)

```tsx
import { Sparkline } from "@/components/prive/ui";

<Sparkline data={[61, 65, 68, 72, 88]} color="#15803D" />
```

80×24px SVG with area fill. Used inside `Metric` or KPI cards.

---

## Pagination

```tsx
import { Pagination } from "@/components/prive/ui";

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  totalItems={items.length}
  pageSize={4}
/>
```

Returns `null` when `totalPages <= 1` — safe to always render.

---

## Skeleton loaders

```tsx
import { Skeleton, MetricSkeleton, CardSkeleton, PageSkeleton } from "@/components/prive/ui";

// Full page loading state (used in Shell's <Suspense fallback>)
<PageSkeleton />

// Single card loading state
<CardSkeleton rows={3} />

// Single metric tile loading state
<MetricSkeleton />

// Raw animated rectangle
<Skeleton className="h-4 w-32" />
```

---

## ConfidenceTag

```tsx
import { ConfidenceTag } from "@/components/prive/ui";

<ConfidenceTag level="High" pct={94} />    // teal pill
<ConfidenceTag level="Medium" pct={71} />  // amber pill
<ConfidenceTag level="Low" />              // red pill
```
