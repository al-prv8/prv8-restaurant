import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#101828]/[0.08] ${className}`} />
  );
}

export function MetricSkeleton() {
  return (
    <div className="rounded-xl border border-[#101828]/8 bg-white p-4 shadow-xs space-y-3">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-[#101828]/10 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-[#101828]/6 p-3">
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
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <CardSkeleton rows={4} />
        </div>
        <div className="lg:col-span-6">
          <CardSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}

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
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#101828]/10 bg-[#FAFAFC] p-3 text-xs shadow-xs">
      <div className="text-[#101828]/60 font-semibold flex items-center justify-between sm:justify-start gap-1.5 w-full sm:w-auto">
        <div className="flex items-center gap-1.5">
          <span>Showing</span>
          <span className="font-bold text-[#101828] bg-white px-2 py-0.5 rounded-md border border-[#101828]/10 shadow-2xs">
            {startItem} - {endItem}
          </span>
          {totalItems ? <>of <span className="font-bold text-[#101828]">{totalItems}</span></> : null}
        </div>
        <span className="sm:hidden text-[10px] text-[#101828]/40 font-bold uppercase">
          Pg {currentPage}/{totalPages}
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 w-full sm:w-auto overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border border-[#101828]/12 bg-white px-2.5 sm:px-3 py-1.5 font-bold text-[#101828]/80 hover:bg-[#101828]/5 hover:text-[#101828] disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all flex items-center gap-1 shrink-0"
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
                  ? "bg-[#5146E5] text-white shadow-xs"
                  : "text-[#101828]/70 hover:bg-[#101828]/5 bg-white border border-[#101828]/8"
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
          className="rounded-lg border border-[#101828]/12 bg-white px-2.5 sm:px-3 py-1.5 font-bold text-[#101828]/80 hover:bg-[#101828]/5 hover:text-[#101828] disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all flex items-center gap-1 shrink-0"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

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
    <div className="mb-6 rounded-2xl border border-[#7C3AED]/25 bg-gradient-to-r from-[#7C3AED]/[0.06] via-white to-white p-3 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#7C3AED] text-xs font-bold text-white shadow-xs">
            ✦
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
              <span>Privé Cognitive Signal</span>
              <span className="rounded-full bg-[#7C3AED]/12 px-2 py-0.5 text-[9px] font-bold text-[#7C3AED]">
                Live AI
              </span>
            </div>
            <p className="text-xs font-semibold text-[#101828] truncate">{summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {action && actionLabel ? (
            <button
              type="button"
              onClick={action}
              className="rounded-lg bg-[#7C3AED] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#6d28d9] shadow-xs transition-all"
            >
              {actionLabel}
            </button>
          ) : null}
          {details && details.length > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg border border-[#7C3AED]/20 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#7C3AED] hover:bg-[#7C3AED]/5 transition-all"
            >
              {expanded ? "Hide Details" : "View Insights"}
            </button>
          ) : null}
        </div>
      </div>

      {expanded && details && details.length > 0 ? (
        <div className="mt-3 border-t border-[#7C3AED]/15 pt-3 space-y-2 text-xs animate-in fade-in duration-150">
          <ul className="space-y-1 font-medium text-[#101828]/80 list-disc pl-5">
            {details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <div className="text-[10px] text-[#101828]/40 pt-1 font-medium">
            Sources: {sources.join(" · ")}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BadgeWithDot({
  children,
  color = "success",
}: {
  children: ReactNode;
  color?: "success" | "brand" | "warning";
}) {
  const colorCls =
    color === "success"
      ? "border-[#0F9D8A]/30 bg-[#0F9D8A]/10 text-[#0B7A6C]"
      : color === "warning"
      ? "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309]"
      : "border-[#5146E5]/30 bg-[#5146E5]/10 text-[#5146E5]";
  const dotCls =
    color === "success" ? "bg-[#0F9D8A]" : color === "warning" ? "bg-[#F59E0B]" : "bg-[#5146E5]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${colorCls}`}
    >
      <span className={`size-1.5 rounded-full animate-pulse ${dotCls}`} />
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "intel" | "alert";
}) {
  const toneCls =
    tone === "intel"
      ? "border-[#7C3AED]/25 bg-gradient-to-br from-[#7C3AED]/[0.05] via-white to-white shadow-[0_4px_20px_-4px_rgba(124,58,237,0.08)]"
      : tone === "alert"
        ? "border-[#F59E0B]/30 bg-gradient-to-br from-[#F59E0B]/[0.05] via-white to-white shadow-[0_4px_20px_-4px_rgba(245,158,11,0.08)]"
        : "border-[#101828]/10 bg-white shadow-[0_2px_8px_-2px_rgba(16,24,40,0.04)]";
  return (
    <section className={`rounded-2xl border ${toneCls} p-5 transition-all duration-200 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#101828]/60 flex items-center gap-2">
        <span className="inline-block size-1.5 rounded-full bg-[#5146E5]" />
        {children}
      </h2>
      {hint ? <span className="rounded-full bg-[#101828]/5 px-2.5 py-0.5 text-[11px] font-medium text-[#101828]/50">{hint}</span> : null}
    </div>
  );
}

export function Sparkline({ data, color = "#5146E5" }: { data: number[]; color?: string }) {
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
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${fillGradientId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const color =
    tone === "good" ? "text-[#0F9D8A]" : tone === "warn" ? "text-[#B45309]" : tone === "bad" ? "text-[#DC3545]" : "text-[#101828]";
  const strokeColor = tone === "good" ? "#0F9D8A" : tone === "warn" ? "#B45309" : tone === "bad" ? "#DC3545" : "#5146E5";

  return (
    <div className="rounded-xl border border-[#101828]/8 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-[#101828]/15">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#101828]/45">{label}</div>
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <div className={`text-2xl font-bold tracking-tight tabular-nums ${color}`}>{value}</div>
        {sparkline ? <Sparkline data={sparkline} color={strokeColor} /> : null}
      </div>
      {sub ? <div className="mt-1 text-[11px] font-medium text-[#101828]/50">{sub}</div> : null}
    </div>
  );
}

const badgeTones: Record<string, string> = {
  neutral: "bg-[#101828]/6 text-[#101828]/70 border border-[#101828]/8",
  indigo: "bg-[#5146E5]/10 text-[#5146E5] border border-[#5146E5]/20",
  violet: "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20",
  teal: "bg-[#0F9D8A]/12 text-[#0B7A6C] border border-[#0F9D8A]/25",
  amber: "bg-[#F59E0B]/15 text-[#92400E] border border-[#F59E0B]/30",
  red: "bg-[#DC3545]/12 text-[#B02A37] border border-[#DC3545]/25",
};

export function Pill({ tone = "neutral", children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

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
    primary: "bg-[#5146E5] text-white hover:bg-[#4238cf] shadow-[#5146E5]/20",
    violet: "bg-[#7C3AED] text-white hover:bg-[#6d28d9] shadow-[#7C3AED]/20",
    danger: "bg-[#DC3545] text-white hover:bg-[#b02a37] shadow-[#DC3545]/20",
    ghost: "border border-[#101828]/15 bg-white text-[#101828] hover:bg-[#101828]/[0.04]",
    quiet: "text-[#5146E5] hover:bg-[#5146E5]/10 shadow-none",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Meter({ value, tone = "indigo" }: { value: number; tone?: "indigo" | "teal" | "amber" | "red" }) {
  const color = { indigo: "#5146E5", teal: "#0F9D8A", amber: "#F59E0B", red: "#DC3545" }[tone];
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#101828]/8 p-0.5">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

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
    <div className="mb-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap rounded-xl border border-[#101828]/10 bg-white p-1.5 shadow-sm">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
              isActive
                ? "bg-[#5146E5] text-white shadow-sm"
                : "text-[#101828]/60 hover:bg-[#101828]/5 hover:text-[#101828]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== 0 ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                  isActive ? "bg-white/20 text-white" : "bg-[#5146E5]/10 text-[#5146E5]"
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

export function ConfidenceTag({ level, pct }: { level: string; pct?: number }) {
  const tone: keyof typeof badgeTones = level === "High" ? "teal" : level === "Medium" ? "amber" : "red";
  return (
    <Pill tone={tone}>
      {level} confidence{pct ? ` · ${pct}%` : ""}
    </Pill>
  );
}

export function stateTone(state: string): keyof typeof badgeTones {
  return state === "Healthy" ? "teal" : state === "Watch" ? "amber" : state === "Action Required" ? "amber" : "red";
}
