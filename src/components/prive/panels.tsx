"use client";

import type { ReactNode } from "react";
import { Card, Meter, Pill, SectionTitle } from "./ui";
import { usePrive, type OpAlert } from "@/lib/prive/store";

// Alert type → pill tone mapping
const alertTone: Record<string, "red" | "amber" | "indigo" | "teal" | "neutral"> = {
  Critical: "red",
  "Action Required": "amber",
  Predictive: "indigo",
  Opportunity: "teal",
  Informational: "neutral",
};

// ─── Row ─────────────────────────────────────────────────────────────────────
export function Row({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/60 backdrop-blur-sm px-3 py-2.5 transition-colors hover:bg-white/80 shadow-sm">
      <div className="min-w-0">{children}</div>
      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </div>
  );
}

// ─── AlertCard ───────────────────────────────────────────────────────────────
export function AlertCard({ a, onDismiss }: { a: OpAlert; onDismiss: () => void }) {
  const tone = alertTone[a.type] ?? "neutral";
  const borderColor =
    tone === "red" ? "border-l-[#B91C1C]" :
    tone === "amber" ? "border-l-[#B45309]" :
    tone === "indigo" ? "border-l-[#881337]" :
    tone === "teal" ? "border-l-[#15803D]" :
    "border-l-[#E7E5E0]";

  return (
    <div className={`rounded-xl bg-white/60 backdrop-blur-md shadow-md ring-1 ring-black/[0.04] px-4 py-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Pill tone={tone}>{a.type}</Pill>
            <span className="text-[11px] font-medium text-[#A8A29E]" >Priority {a.priority}</span>
          </div>
          <div className="mt-1.5 text-[13px] font-semibold text-[#1C1917]">{a.title}</div>
          <p className="mt-0.5 text-xs font-medium text-[#78716C] leading-snug">{a.detail}</p>
          <p className="mt-1 text-[11px] text-[#A8A29E]">Impact: {a.impact}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold text-[#A8A29E] hover:bg-white/10 hover:text-[#1C1917] transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

// ─── MorningBrief ─────────────────────────────────────────────────────────────
export function MorningBrief() {
  const { derived: d } = usePrive();
  return (
    <Card tone="intel">
      <SectionTitle hint="Generated 6:04 AM">Morning Operations Brief</SectionTitle>
      <p className="mb-3 text-[13px] font-semibold text-[#1C1917]">
        Good morning, Jordan.{" "}
        <span className="font-medium text-[#78716C]">
          {d.brief.filter(Boolean).length} item{d.brief.filter(Boolean).length !== 1 ? "s" : ""} require your attention today.
        </span>
      </p>
      <ol className="space-y-2.5">
        {d.brief.map((line, i) => (
          <li key={i} className="flex gap-3 text-[13px] text-[#44403C]">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#881337] text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <span className="leading-snug">{line}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[11px] font-medium text-[#A8A29E]">
        Sources: Toast POS · Restaurant365 · 7shifts · Paycor · Guest Feedback CRM
      </p>
    </Card>
  );
}

// ─── ReadinessCard ────────────────────────────────────────────────────────────
export function ReadinessCard() {
  const { derived: d, dispatch } = usePrive();
  const ready = d.readiness.score >= 85;
  const scoreColor = ready ? "text-[#15803D]" : d.readiness.score >= 70 ? "text-[#B45309]" : "text-[#B91C1C]";

  return (
    <Card tone={ready ? "default" : "alert"}>
      <SectionTitle hint="Tomorrow">Readiness Score</SectionTitle>
      <div className="flex items-end gap-3 mb-3">
        <span className={`text-5xl font-bold tabular-nums leading-none ${scoreColor}`}>
          {d.readiness.score}%
        </span>
        <div className="mb-1">
          <Pill tone={ready ? "teal" : "amber"}>
            {ready ? "Ready" : "Action Required"}
          </Pill>
        </div>
      </div>
      <Meter value={d.readiness.score} tone={ready ? "teal" : d.readiness.score >= 70 ? "amber" : "red"} />

      <ul className="mt-4 space-y-2">
        {d.readiness.risks.map((r) => (
          <li key={r.label} className="rounded-xl bg-white/40 backdrop-blur-sm px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold text-[#1C1917]">{r.label}</span>
              <Pill tone={r.probability > 50 ? "red" : "amber"}>{r.probability}% risk</Pill>
            </div>
            <p className="mt-1 text-xs font-medium text-[#78716C]">{r.detail}</p>
          </li>
        ))}
        {d.readiness.risks.length === 0 ? (
          <li className="rounded-lg border border-[#15803D]/20 bg-[#15803D]/5 px-3 py-2.5 text-[13px] font-medium text-[#15803D]">
            ✓ No open risks — every tracked driver is inside tolerance.
          </li>
        ) : null}
      </ul>

      {/* Ask Privé trigger */}
      <button
        type="button"
        onClick={() => dispatch({ type: "askPriveTrigger", question: "Can we handle tomorrow?" })}
        className="mt-4 flex w-full items-center gap-2.5 rounded-lg border border-[#881337]/20 bg-[#881337]/5 px-3 py-2.5 text-left text-[13px] font-semibold text-[#881337] transition-colors hover:bg-[#881337]/10"
      >
        <span className="opacity-70">✦</span>
        Ask Privé: &ldquo;Can we handle tomorrow?&rdquo;
      </button>
    </Card>
  );
}
