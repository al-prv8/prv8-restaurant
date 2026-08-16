"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const BRAND = "#881337";   // deep burgundy
const CHARCOAL = "#1C1917";
const STONE = "#78716C";
const GREEN = "#15803D";
const AMBER = "#B45309";
const RED = "#B91C1C";

// ─── Skeleton primitives ─────────────────────────────────────────────────────
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#1C1917]/[0.07] ${className}`} />
  );
}

export function MetricSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-4 space-y-3">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-[#F7F5F2] p-3">
            <div className="space-y-1.5 flex-1 pr-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6"><CardSkeleton rows={4} /></div>
        <div className="lg:col-span-6"><CardSkeleton rows={4} /></div>
      </div>
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 6,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems ?? totalPages * pageSize);

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F3F2F0] pt-3 text-xs">
      <div className="text-[#78716C] font-semibold flex items-center gap-1.5">
        <span>Showing</span>
        <span className="font-bold text-[#1C1917]">{startItem}–{endItem}</span>
        {totalItems ? <>of <span className="font-bold text-[#1C1917]">{totalItems}</span></> : null}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border border-[#E7E5E0] bg-white px-2.5 py-1.5 font-semibold text-[#44403C] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="size-3.5" />
          <span>Prev</span>
        </button>

        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`size-7 rounded-md text-xs font-bold transition-colors ${
                p === currentPage
                  ? "bg-[#881337] text-white"
                  : "text-[#78716C] hover:bg-[#F7F5F2] border border-[#E7E5E0] bg-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md border border-[#E7E5E0] bg-white px-2.5 py-1.5 font-semibold text-[#44403C] hover:bg-[#F7F5F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Operations Brief (formerly PriveIntelBanner) ─────────────────────────────
// Clean white card, no dark background, enterprise professional tone
export function PriveIntelBanner({
  summary,
  details,
  sources = ["Toast POS", "7shifts", "Restaurant365", "Paycor"],
  action,
  actionLabel,
}: {
  summary: string;
  details?: string[];
  sources?: string[];
  action?: () => void;
  actionLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-black text-white"
            style={{ backgroundColor: "#881337" }}
          >
            P
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] mb-0.5">
              Operations Brief · Privé
            </div>
            <p className="text-sm font-medium text-[#1C1917] leading-snug">{summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pl-9 sm:pl-0">
          {action && actionLabel ? (
            <button
              type="button"
              onClick={action}
              className="rounded-md px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#881337" }}
            >
              {actionLabel}
            </button>
          ) : null}
          {details && details.length > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="rounded-md border border-[#E7E5E0] bg-[#F7F5F2] px-3 py-1.5 text-xs font-semibold text-[#78716C] hover:bg-[#EFEDE9] transition-all"
            >
              {expanded ? "Collapse" : "Details"}
            </button>
          ) : null}
        </div>
      </div>

      {expanded && details && details.length > 0 ? (
        <div className="mt-3 border-t border-[#F3F2F0] pt-3 space-y-2 animate-in fade-in duration-150">
          <ul className="space-y-1.5 text-[12px] font-medium text-[#78716C] list-none pl-9">
            {details.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 size-1 rounded-full bg-[#881337] shrink-0" />
                {d}
              </li>
            ))}
          </ul>
          <div className="text-[10px] text-[#A8A29E] pt-1 font-medium pl-9">
            Sources: {sources.join(" · ")}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Status dot + label ──────────────────────────────────────────────────────
export function BadgeWithDot({
  children,
  color = "success",
}: {
  children: ReactNode;
  color?: "success" | "brand" | "warning";
}) {
  const colorCls =
    color === "success"
      ? "border-[#15803D]/30 bg-[#15803D]/10 text-[#15803D]"
      : color === "warning"
      ? "border-[#B45309]/30 bg-[#B45309]/10 text-[#B45309]"
      : "border-[#881337]/30 bg-[#881337]/10 text-[#881337]";

  const dotCls =
    color === "success" ? "bg-[#15803D]" : color === "warning" ? "bg-[#B45309]" : "bg-[#881337]";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${colorCls}`}>
      <span className="relative flex size-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotCls}`} />
        <span className={`relative inline-flex size-2 rounded-full ${dotCls}`} />
      </span>
      {children}
    </span>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "intel" | "alert";
}) {
  const toneClass =
    tone === "intel"
      ? "bg-white border-[#881337]/15"
      : tone === "alert"
      ? "bg-white border-[#B91C1C]/20"
      : "bg-white border-[#E7E5E0]";

  return (
    <section
      className={`rounded-xl border shadow-sm p-5 ${toneClass} ${className}`}
    >
      {children}
    </section>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#A8A29E]">
        {children}
      </h2>
      {hint ? (
        <span className="rounded-md bg-[#F7F5F2] border border-[#E7E5E0] px-2 py-0.5 text-[11px] font-medium text-[#78716C]">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────
export function Sparkline({ data, color = "#881337" }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const fillGradientId = `grad-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="shrink-0 overflow-visible">
      <defs>
        <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${fillGradientId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── RadialGauge ─────────────────────────────────────────────────────────────
export function RadialGauge({
  value,
  size = 110,
  strokeWidth = 10,
  color,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const strokeColor = color ?? (value >= 85 ? "#15803D" : value >= 70 ? "#B45309" : "#B91C1C");

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-black/[0.06]"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black tabular-nums tracking-tight text-[#1C1917]">{value}%</span>
      </div>
    </div>
  );
}

// ─── Metric tile ─────────────────────────────────────────────────────────────
export function Metric({
  label,
  value,
  sub,
  tone = "neutral",
  sparkline,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "good" | "warn" | "bad";
  sparkline?: number[];
}) {
  const valueColor =
    tone === "good" ? `text-[${GREEN}]` : tone === "warn" ? `text-[${AMBER}]` : tone === "bad" ? `text-[${RED}]` : `text-[${CHARCOAL}]`;
  const strokeColor = tone === "good" ? GREEN : tone === "warn" ? AMBER : tone === "bad" ? RED : BRAND;

  return (
    <div className="rounded-xl bg-white border border-[#E7E5E0] shadow-sm px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E]">{label}</div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <div className={`text-2xl font-bold tracking-tight tabular-nums ${valueColor}`}>{value}</div>
        {sparkline ? <Sparkline data={sparkline} color={strokeColor} /> : null}
      </div>
      {sub ? <div className="mt-1.5 text-[11px] font-medium text-[#78716C]">{sub}</div> : null}
    </div>
  );
}

// ─── Pill / Badge ─────────────────────────────────────────────────────────────
const badgeTones: Record<string, string> = {
  neutral: "bg-[#F7F5F2] text-[#78716C] border border-[#E7E5E0]",
  indigo:  "bg-[#881337]/8 text-[#881337] border border-[#881337]/20",
  violet:  "bg-[#881337]/8 text-[#881337] border border-[#881337]/20",
  teal:    "bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/25",
  amber:   "bg-[#B45309]/10 text-[#B45309] border border-[#B45309]/25",
  red:     "bg-[#B91C1C]/8 text-[#B91C1C] border border-[#B91C1C]/20",
};

export function Pill({ tone = "neutral", children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

// ─── Status Dot (for tables) ─────────────────────────────────────────────────
export function StatusDot({ tone }: { tone: "green" | "emerald" | "good" | "amber" | "warn" | "red" | "bad" | "blue" | "gray" }) {
  const colors: Record<string, string> = {
    green:   "bg-[#15803D]",
    emerald: "bg-[#15803D]",
    good:    "bg-[#15803D]",
    amber:   "bg-[#B45309]",
    warn:    "bg-[#B45309]",
    red:     "bg-[#B91C1C]",
    bad:     "bg-[#B91C1C]",
    blue:    "bg-[#4F46E5]",
    gray:    "bg-[#A8A29E]",
  };
  return <span className={`inline-block size-2 rounded-full ${colors[tone] ?? "bg-[#A8A29E]"} shrink-0`} />;
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "violet" | "danger" | "quiet";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";
  const styles = {
    primary: "bg-[#881337] text-white hover:bg-[#6B0F2A] shadow-sm",
    violet:  "bg-[#881337] text-white hover:bg-[#6B0F2A] shadow-sm",
    danger:  "bg-[#B91C1C] text-white hover:bg-[#991B1B] shadow-sm",
    ghost:   "bg-white border border-[#E7E5E0] text-[#1C1917] hover:bg-[#F7F5F2]",
    quiet:   "text-[#881337] hover:bg-[#881337]/8 shadow-none",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

// ─── Meter ───────────────────────────────────────────────────────────────────
export function Meter({ value, tone = "indigo" }: { value: number; tone?: "indigo" | "teal" | "amber" | "red" }) {
  const color = { indigo: BRAND, teal: GREEN, amber: AMBER, red: RED }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F3F2F0]">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

// ─── Page Tabs — underline style, no pill fills ───────────────────────────────
export function PageTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: T; label: string; badge?: number | string }>;
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="mb-6 flex items-center gap-0 border-b border-[#E7E5E0] overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold whitespace-nowrap border-b-2 transition-all duration-150 shrink-0 ${
              isActive
                ? "border-[#881337] text-[#881337]"
                : "border-transparent text-[#78716C] hover:text-[#1C1917] hover:border-[#E7E5E0]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== 0 ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black tabular-nums transition-all ${
                  isActive ? "bg-[#881337] text-white" : "bg-[#F7F5F2] text-[#78716C]"
                }`}
              >
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

// ─── Confidence tag ───────────────────────────────────────────────────────────
export function ConfidenceTag({ level, pct }: { level: string; pct?: number }) {
  const tone: keyof typeof badgeTones = level === "High" ? "teal" : level === "Medium" ? "amber" : "red";
  return (
    <Pill tone={tone}>
      {level} confidence{pct ? ` · ${pct}%` : ""}
    </Pill>
  );
}

export function stateTone(state: string): keyof typeof badgeTones {
  return state === "Healthy" ? "teal" : state === "Watch" ? "amber" : "red";
}

// ─── Data Table primitives ────────────────────────────────────────────────────
export function DataTable({
  children,
  className = "",
  columns,
  data,
}: {
  children?: ReactNode;
  className?: string;
  // Simple mode: pass columns + data array of objects
  columns?: string[];
  data?: Array<Record<string, ReactNode>>;
}) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-[#E7E5E0] ${className}`}>
      <table className="w-full text-sm">
        {columns && data ? (
          <>
            <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0]">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-[#F3F2F0] last:border-0">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-[#1C1917]">{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        ) : children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0]">
      {children}
    </thead>
  );
}

export function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

export function Tr({ children, className = "", onClick, selected }: { children: ReactNode; className?: string; onClick?: () => void; selected?: boolean }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-[#F3F2F0] last:border-0 transition-colors ${onClick ? "cursor-pointer hover:bg-[#FAFAF8]" : ""} ${selected ? "bg-[#FFF8F6]" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-[#1C1917] ${className}`}>
      {children}
    </td>
  );
}

// ─── KPI Row (compact horizontal strip) ──────────────────────────────────────
type KpiTone = "neutral" | "good" | "warn" | "bad" | "positive" | "negative" | "warning" | "critical";
export function KpiRow({ items }: {
  items: Array<{
    label: string;
    // value can be string or number
    value: string | number;
    // sub/subtext are aliases
    sub?: string;
    subtext?: string;
    // tone aliases
    tone?: KpiTone;
    trend?: string; // ignored visually, kept for compat
    // override the value color directly
    valueColor?: string;
  }>
}) {
  const toneColor = (tone?: KpiTone): string => {
    if (tone === "good" || tone === "positive") return "text-[#15803D]";
    if (tone === "warn" || tone === "warning") return "text-[#B45309]";
    if (tone === "bad" || tone === "negative" || tone === "critical") return "text-[#B91C1C]";
    return "text-[#1C1917]";
  };

  return (
    <div
      className="mb-6 grid divide-x divide-[#F3F2F0] rounded-xl border border-[#E7E5E0] bg-white shadow-sm overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item, i) => {
        const colorClass = item.valueColor ?? toneColor(item.tone);
        const subtitle = item.sub ?? item.subtext;
        return (
          <div key={i} className="px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] mb-1">{item.label}</div>
            <div className={`text-xl font-bold tabular-nums ${colorClass}`}>{String(item.value)}</div>
            {subtitle && <div className="text-[11px] font-medium text-[#78716C] mt-0.5">{subtitle}</div>}
          </div>
        );
      })}
    </div>
  );
}
