---
name: prive-charts
description: >
  Patterns and copy-ready SVG chart implementations used throughout the Privé
  project. Use this skill when adding any data visualization. All charts are
  custom inline SVG — no chart library is used.
---

# Privé Chart Patterns

All charts are **custom inline SVG**. No Recharts, Chart.js, or D3 dependency.  
Every chart uses the project's color tokens directly.

---

## Chart Design Rules

1. **Background:** Always `bg-white border border-[#E7E5E0] rounded-xl p-5`
2. **Header:** Eyebrow label (crimson) + title (black) + optional right-aligned badge
3. **Legend:** Inline flex row of `size-2 rounded-full` color dots + labels
4. **Grid lines:** `stroke="#E7E5E0"` dashed (`strokeDasharray="4 4"`) at 25%/50%/75%
5. **Reference/target lines:** `stroke="#B45309"` dashed — labeled at right edge
6. **Tooltip:** Small `rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-3` card below chart
7. **Responsive:** `viewBox` + `className="w-full"` + `style={{ minWidth: 280 }}`

---

## 1. Dual-Axis Sales vs Labor Line Chart

**Location:** `app/gm/home/page.tsx` — `HourlySalesLaborChart` component

```tsx
function HourlySalesLaborChart() {
  const [activeIdx, setActiveIdx] = useState<number | null>(6);
  const hours = [
    { time: "10 AM", sales: 320, labor: 110 },
    // ... 12 data points
  ];
  const maxSales = 1000;

  return (
    <div className="bg-white border border-[#E7E5E0] rounded-xl p-5 my-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Tomorrow's Curve</div>
          <div className="text-base font-black text-[#1C1917]">Hourly Sales vs Labor Cost</div>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-[#15803D]">
            <span className="size-2 rounded-full bg-[#15803D]" /> Sales ($/hr)
          </span>
          <span className="flex items-center gap-1.5 text-[#881337]">
            <span className="size-2 rounded-full bg-[#881337]" /> Labor Cost ($/hr)
          </span>
        </div>
      </div>

      <div className="relative h-44 w-full pt-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Area fill under sales curve */}
          <path
            d={`M 0,120 ${hours.map((h, i) => `L ${(i * 600) / 11},${120 - (h.sales / maxSales) * 110}`).join(" ")} L 600,120 Z`}
            fill="url(#salesGrad)"
          />
          {/* Sales line */}
          <path
            d={`M ${hours.map((h, i) => `${(i * 600) / 11},${120 - (h.sales / maxSales) * 110}`).join(" L ")}`}
            fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round"
          />
          {/* Labor dashed line */}
          <path
            d={`M ${hours.map((h, i) => `${(i * 600) / 11},${120 - (h.labor / maxSales) * 110}`).join(" L ")}`}
            fill="none" stroke="#881337" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round"
          />
          {/* Interactive nodes */}
          {hours.map((h, i) => {
            const x = (i * 600) / 11;
            const ySales = 120 - (h.sales / maxSales) * 110;
            const isHover = activeIdx === i;
            return (
              <g key={h.time} className="cursor-pointer" onMouseEnter={() => setActiveIdx(i)}>
                <circle cx={x} cy={ySales} r={isHover ? 6 : 3.5}
                  className={`transition-all ${isHover ? "fill-[#881337] stroke-white stroke-2" : "fill-[#15803D]"}`}
                />
              </g>
            );
          })}
        </svg>
      </div>
      {/* X-axis labels */}
      <div className="flex justify-between text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mt-2">
        {hours.map((h) => <span key={h.time}>{h.time}</span>)}
      </div>
    </div>
  );
}
```

---

## 2. Staffing Coverage Bar Chart

**Location:** `app/gm/staffing/page.tsx`

Pattern: Grouped bars (scheduled vs recommended) per hour slot.

```tsx
// Core SVG bar rendering pattern
const BAR_W = 18, GAP = 4, SLOT_W = 54, H = 100;

{hours.map((h, i) => {
  const x = i * SLOT_W;
  const schedH = Math.round((h.scheduled / maxVal) * H);
  const recH = Math.round((h.recommended / maxVal) * H);
  const under = h.scheduled < h.recommended;
  return (
    <g key={h.label}>
      {/* Scheduled bar */}
      <rect x={x + GAP} y={H - schedH} width={BAR_W} height={schedH}
        fill={under ? "#B45309" : "#15803D"} rx="3" />
      {/* Recommended bar */}
      <rect x={x + GAP + BAR_W + 3} y={H - recH} width={BAR_W} height={recH}
        fill="#D6D3D1" rx="3" />
      {/* Hour label */}
      <text x={x + SLOT_W / 2} y={H + 14} textAnchor="middle"
        fontSize="9" fill="#A8A29E" fontWeight="600">{h.label}</text>
    </g>
  );
})}
```

---

## 3. Inventory Depletion Curve (Area Chart)

**Location:** `app/gm/inventory/page.tsx`

Pattern: Area fill showing stock level over time with a vertical "Runs Out" marker.

```tsx
const points = data.map((d, i) => ({
  x: PAD_L + (i / (data.length - 1)) * (W - PAD_L),
  y: PAD_T + (1 - d.stock / maxStock) * (H - PAD_T - PAD_B),
}));

// Area fill (green to transparent)
<path d={`M ${points[0].x},${points[0].y} ${points.map(p => `L ${p.x},${p.y}`).join(" ")} L ${points.at(-1)!.x},${H - PAD_B} L ${points[0].x},${H - PAD_B} Z`}
  fill="#15803D" opacity="0.12" />

// Stock curve line
<path d={`M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`}
  fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />

// "Runs Out" vertical marker
<line x1={runsOutX} y1={PAD_T} x2={runsOutX} y2={H - PAD_B}
  stroke="#B91C1C" strokeWidth="1.5" strokeDasharray="4 2" />
<text x={runsOutX + 4} y={PAD_T + 10} fontSize="9" fill="#B91C1C" fontWeight="700">
  Runs Out ~{runsOutTime}
</text>
```

---

## 4. Complaint Trend Bar Chart (7-day)

**Location:** `app/gm/guests/page.tsx`

Pattern: Vertical bars with average reference line. Today's bar is highlighted crimson.

```tsx
// Key variables
const BAR_W = 48, GAP = 26, H = 100, PAD_L = 8;
const max = Math.max(...days.map(d => d.complaints), 1);
const avg = days.reduce((a, d) => a + d.complaints, 0) / days.length;

// Average reference line
<line x1={PAD_L} y1={H - (avg / max) * H}
  x2={days.length * (BAR_W + GAP) + PAD_L} y2={H - (avg / max) * H}
  stroke="#B45309" strokeWidth="1" strokeDasharray="4 3" />
<text x={...} fontSize="8" fill="#B45309" fontWeight="700">Avg</text>

// Color logic
const isToday = i === days.length - 1;
const isElevated = d.complaints > avg && !isToday;
const fill = isToday ? "#881337" : isElevated ? "#B45309" : "#D6D3D1";
```

---

## 5. Guest Sentiment Trend (8-week Line Chart)

**Location:** `app/executive/pulse/page.tsx`

Pattern: Line chart with Y-axis labels, target dashed line, area fill.

```tsx
const W = 520, H = 90, PAD_L = 32, PAD_B = 20;
const minScore = 3.5, maxScore = 5.0;
const px = (i: number) => PAD_L + (i / (weeks.length - 1)) * (W - PAD_L);
const py = (v: number) => H - PAD_B - ((v - minScore) / (maxScore - minScore)) * (H - PAD_B - 8);

// Auto-color by trend direction
const trend = weeks.at(-1)!.score >= weeks[0].score;
const lineColor = trend ? "#15803D" : "#B91C1C";

// Y-axis gridlines
{[3.5, 4.0, 4.5, 5.0].map(v => (
  <g key={v}>
    <line x1={PAD_L} y1={py(v)} x2={W} y2={py(v)} stroke="#F3F2F0" strokeWidth="1" />
    <text x={PAD_L - 4} y={py(v) + 3.5} textAnchor="end" fontSize="8" fill="#A8A29E">{v.toFixed(1)}</text>
  </g>
))}
```

---

## 6. Cross-Location Readiness Comparison (Horizontal Bars)

**Location:** `app/regional/portfolio/page.tsx`

Pattern: Sorted horizontal progress bars, clickable to select a location.

```tsx
{[...d.health].sort((a, b) => b.score - a.score).map(({ restaurant: r, score, state: s }) => {
  const color = score >= 85 ? "#15803D" : score >= 70 ? "#B45309" : "#B91C1C";
  return (
    <div key={r.id}
      onClick={() => dispatch({ type: "regionalRestaurant", id: r.id })}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors
        ${isSelected ? "bg-[#F7F5F2] ring-1 ring-[#881337]/30" : "hover:bg-[#F7F5F2]"}`}>
      <div className="w-36 shrink-0 text-[11px] font-bold text-[#1C1917] truncate">{r.name}</div>
      <div className="flex-1 h-4 bg-[#F3F2F0] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <div className="w-10 shrink-0 text-right text-[11px] font-black tabular-nums"
        style={{ color }}>{score}</div>
    </div>
  );
})}
```

---

## SVG Text Rendering Tips

- Always use `textAnchor="middle"` for centered labels
- Always use `fontSize` as attribute (not CSS) for SVG text
- Use `fontWeight="700"` or `fontWeight="800"` — NOT `font-bold` class
- Fill colors in SVG use `fill="#..."` attribute — NOT Tailwind text classes
- Prefer `viewBox` + `className="w-full"` over fixed pixel widths for responsiveness
- `preserveAspectRatio="none"` on area charts allows width to stretch freely
- Wrap in `<div className="w-full overflow-x-auto">` with `style={{ minWidth: 280 }}`

---

## What NOT to Use

- ❌ Recharts, Chart.js, Victory, Nivo — not installed
- ❌ D3 — not installed
- ❌ Canvas — use SVG for crisp rendering at all DPR
- ❌ Emoji as chart elements (✅ is OK for resolved count labels)
- ❌ `linearGradient` as decorative background washes — only inside `<defs>` for chart fills
