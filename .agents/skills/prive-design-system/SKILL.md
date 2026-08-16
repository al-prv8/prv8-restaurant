---
name: prive-design-system
description: >
  Core design tokens, color palette, typography, spacing, and visual language
  rules for the Privé Restaurant Intelligence platform. Use this skill any time
  you add or edit any UI in this project.
---

# Privé Design System

## Brand Philosophy

This is an **enterprise restaurant intranet/operating system**, NOT an AI startup landing page.  
The intelligence should be apparent because the system observes → understands → predicts → recommends → asks for human approval → acts.  
The viewer should be impressed because it looks like their **business became intelligent** — not because it looks like AI.

> **The final test:** Remove the word "AI" from every screen. The product must still look valuable.

---

## Color Palette

All colors are hardcoded hex values. Do NOT use Tailwind named colors (blue-600, etc.).

```
BRAND (crimson)    #881337    Primary accent, active states, CTAs
BRAND_HOVER        #6B0F2A    Hover state for brand elements
CHARCOAL           #1C1917    Primary text, nav background
STONE              #78716C    Secondary / muted text
MUTED_GRAY         #A8A29E    Labels, hints, placeholders
BORDER             #E7E5E0    Default borders
DIVIDER            #F3F2F0    Internal dividers (lighter than border)
CREAM (bg)         #F7F5F2    Page background, secondary surfaces
WHITE              #FFFFFF    Card surfaces

GREEN (success)    #15803D    Positive states, healthy, resolved
GREEN_HOVER        #4ADE80    Live signal indicator
AMBER (warn)       #B45309    Warning states, watch
RED (danger)       #B91C1C    Error, critical, action required
BLUE               #4F46E5    Informational (used sparingly)
```

### Usage Rules

| Token | Use For |
|-------|---------|
| `#1C1917` | Nav background, page headers, primary text |
| `#881337` | Buttons, active tab underlines, badge highlights, icons |
| `#F7F5F2` | Page background, hovered rows, secondary card bg |
| `#E7E5E0` | All card borders, table borders, form borders |
| `#F3F2F0` | Row dividers inside cards, internal separators |
| `#A8A29E` | Section labels (ALL CAPS), hint text, empty states |

---

## Typography

Font: **System font stack** (no Google Fonts import — Next.js default).

| Use | Classes |
|-----|---------|
| Page H1 | `text-3xl font-black tracking-tight text-[#1C1917]` |
| Section eyebrow | `text-[10px] font-bold uppercase tracking-[0.15em–0.2em] text-[#881337]` |
| Section title (inside card) | `text-[11px] font-bold uppercase tracking-[0.15em] text-[#A8A29E]` |
| Card title | `text-base font-black text-[#1C1917]` |
| Body / description | `text-sm font-medium text-[#78716C]` |
| KPI value | `text-xl font-bold tabular-nums` |
| Large metric | `text-3xl font-black tabular-nums` |
| Micro label | `text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]` |
| Table header | `text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]` |
| Table cell | `text-[#1C1917]` (no extra size — inherits `text-sm` from table) |

---

## Spacing & Layout

- **Page content max-width:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Page top padding:** `pt-28` (64px TopNav + 34px subheader + gap)
- **Page bottom padding:** `pb-24`
- **Standard grid:** `grid gap-6 lg:grid-cols-12` with `lg:col-span-N`
- **Card padding:** `p-5` (standard), `p-4` (compact)
- **Section gap:** `space-y-6` between stacked cards
- **MB after page header:** `mb-8`
- **MB after KpiRow:** `mb-6` (KpiRow already has `mb-6` built in)

---

## Elevation & Shadows

| Level | Class | Use |
|-------|-------|-----|
| Card | `shadow-sm` | All standard cards |
| Dropdown | `shadow-xl` | Nav dropdowns, overlays |
| Drawer | `shadow-2xl` | AskPrivé slide-in panel |
| Floating | Forbidden | No `fixed bottom-N right-N` floating elements |

---

## Borders & Radius

| Element | Radius |
|---------|--------|
| Cards, modals, charts | `rounded-xl` |
| Buttons, pills, tags | `rounded-md` |
| Progress bars, meters | `rounded-full` |
| Table | `rounded-xl` (outer wrapper only) |
| Inline rows | `rounded-lg` |
| Icons / avatar badges | `rounded-lg` (small) or `rounded-md` |

Never use `rounded-3xl` or `rounded-full` for content containers.

---

## What to AVOID

- ❌ `bg-gradient-to-*` on any content surface (only allowed on photo overlays)
- ❌ Pink/blush background washes (`from-rose-*`, `from-pink-*`)
- ❌ `backdrop-blur-*` on content panels (only on dark nav overlays)
- ❌ `shadow-2xl` on cards (only drawers/modals)
- ❌ `rounded-full` for content containers
- ❌ Giant typography (`text-6xl`, `text-7xl`)
- ❌ Floating fixed buttons (`fixed bottom-6 right-6`)
- ❌ Pill-shaped labels as the primary UI pattern
- ❌ The word "AI" in display text (use "Privé", "Intelligence", "Operational")
- ❌ "Immutable Audit Ledger" — use "Audit Trail"
- ❌ "Live Telemetry Mesh" — use "Connected Systems"
