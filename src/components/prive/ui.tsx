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
    <div className="rounded-2xl bg-white/12 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.28)] ring-1 ring-white/20 p-4 space-y-3">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-white/40 backdrop-blur-sm p-3">
            <div className="space-y-1.5 flex-1 pr-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
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
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white/30 backdrop-blur-sm p-3 text-xs shadow-sm">
      <div className="text-[#78716C] font-semibold flex items-center justify-between sm:justify-start gap-1.5 w-full sm:w-auto">
        <div className="flex items-center gap-1.5">
          <span>Showing</span>
          <span className="font-bold text-[#1C1917] bg-white/80 px-2 py-0.5 rounded-md shadow-sm">
            {startItem}–{endItem}
          </span>
          {totalItems ? <>of <span className="font-bold text-[#1C1917]">{totalItems}</span></> : null}
        </div>
        <span className="sm:hidden text-[10px] text-[#A8A29E] font-bold uppercase">
          Pg {currentPage}/{totalPages}
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg bg-white/60 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 font-bold text-[#44403C] hover:bg-white/80 hover:text-[#1C1917] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all flex items-center gap-1 shrink-0"
        >
          <ChevronLeft className="size-3.5" />
          <span>Prev</span>
        </button>

        <div className="flex items-center gap-1 px-1 shrink-0 overflow-x-auto no-scrollbar">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`size-7 rounded-lg text-xs font-bold shrink-0 transition-all ${
                p === currentPage
                  ? "bg-[#881337] text-white shadow-sm"
                  : "text-[#78716C] hover:bg-white/80 bg-white/60"
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
          className="rounded-lg bg-white/60 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 font-bold text-[#44403C] hover:bg-white/80 hover:text-[#1C1917] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all flex items-center gap-1 shrink-0"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Morning Brief / Intel Banner ─────────────────────────────────────────────
// No AI badges. No purple. Clean operational briefing bar.
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
    <div className="mb-6 rounded-2xl bg-[#1C1917]/85 backdrop-blur-md text-white p-4 shadow-xl ring-1 ring-white/[0.06] transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white"
            style={{ backgroundColor: "#881337" }}
          >
            ✦
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
              Morning Operations Brief · Privé
            </div>
            <p className="text-sm font-medium text-white/90 leading-snug">{summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pl-10 sm:pl-0">
          {action && actionLabel ? (
            <button
              type="button"
              onClick={action}
              className="rounded-lg px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#881337" }}
            >
              {actionLabel}
            </button>
          ) : null}
          {details && details.length > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/15 hover:text-white transition-all"
            >
              {expanded ? "Collapse" : "View Details"}
            </button>
          ) : null}
        </div>
      </div>

      {expanded && details && details.length > 0 ? (
        <div className="mt-4 border-t border-white/10 pt-4 space-y-2 animate-in fade-in duration-150">
          <ul className="space-y-1.5 text-[12px] font-medium text-white/70 list-none pl-10">
            {details.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 size-1 rounded-full bg-[#881337] shrink-0" />
                {d}
              </li>
            ))}
          </ul>
          <div className="text-[10px] text-white/30 pt-1 font-medium pl-10">
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
  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/90 before:to-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(31,38,135,0.08)] hover:bg-white/70 p-5 ${className}`}
    >
      {children}
    </section>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#78716C]">
        {children}
      </h2>
      {hint ? (
        <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-[#A8A29E]">
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
    <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/90 before:to-transparent px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(31,38,135,0.08)] hover:bg-white/70">
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
  neutral: "bg-[#1C1917]/6 text-[#78716C]",
  indigo:  "bg-[#881337]/8 text-[#881337] border border-[#881337]/20",
  violet:  "bg-[#881337]/8 text-[#881337] border border-[#881337]/20",
  teal:    "bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/25",
  amber:   "bg-[#B45309]/12 text-[#B45309] border border-[#B45309]/25",
  red:     "bg-[#B91C1C]/10 text-[#B91C1C] border border-[#B91C1C]/25",
};

export function Pill({ tone = "neutral", children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeTones[tone]}`}>
      {children}
    </span>
  );
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
    "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";
  const styles = {
    primary: "bg-[#881337] text-white hover:bg-[#6B0F2A] shadow-[#881337]/20",
    violet:  "bg-[#881337] text-white hover:bg-[#6B0F2A] shadow-[#881337]/20",
    danger:  "bg-[#B91C1C] text-white hover:bg-[#991B1B] shadow-[#B91C1C]/20",
    ghost:   "bg-white/60 backdrop-blur-sm text-[#1C1917] hover:bg-white/80",
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
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#1C1917]/8">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

// ─── Page Tabs ───────────────────────────────────────────────────────────────
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
    <div className="mb-6 flex items-center gap-0 overflow-x-auto no-scrollbar whitespace-nowrap border-b border-[#E7E5E0]">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-all shrink-0 ${
              isActive
                ? "border-[#881337] text-[#881337]"
                : "border-transparent text-[#78716C] hover:text-[#1C1917] hover:border-[#A8A29E]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== 0 ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                  isActive ? "bg-[#881337] text-white" : "bg-[#1C1917]/8 text-[#78716C]"
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
