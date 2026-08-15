import type { ReactNode } from "react";
import { Card, Meter, Pill, SectionTitle } from "./ui";
import { usePrive, type OpAlert } from "@/lib/prive/store";

const alertTone: Record<string, "red" | "amber" | "violet" | "teal" | "neutral"> = {
  Critical: "red",
  "Action Required": "amber",
  Predictive: "violet",
  Opportunity: "teal",
  Informational: "neutral",
};

export function Row({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#101828]/8 bg-white px-3 py-2.5">
      <div className="min-w-0">{children}</div>
      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </div>
  );
}

export function AlertCard({ a, onDismiss }: { a: OpAlert; onDismiss: () => void }) {
  return (
    <div className="rounded-lg border border-[#101828]/8 bg-white px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Pill tone={alertTone[a.type] ?? "neutral"}>{a.type}</Pill>
            <span className="text-[11px] text-[#101828]/40">Priority {a.priority}</span>
          </div>
          <div className="mt-1.5 text-sm font-medium">{a.title}</div>
          <p className="mt-0.5 text-xs text-[#101828]/60">{a.detail}</p>
          <p className="mt-1 text-[11px] text-[#101828]/40">Impact: {a.impact}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md px-2 py-1 text-[11px] font-semibold text-[#101828]/40 hover:bg-[#101828]/5"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function MorningBrief() {
  const { derived: d } = usePrive();
  return (
    <Card tone="intel">
      <SectionTitle hint="Generated 6:04 AM">Morning intelligence brief</SectionTitle>
      <p className="mb-3 text-sm font-medium text-[#101828]/80">
        Good morning, Jordan.{" "}
        <span className="font-normal text-[#101828]/60">
          {d.brief.filter(Boolean).length} item{d.brief.filter(Boolean).length !== 1 ? "s" : ""} require your attention today.
        </span>
      </p>
      <ol className="space-y-2">
        {d.brief.map((line, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-[#101828]/80">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/12 text-[11px] font-semibold text-[#7C3AED]">
              {i + 1}
            </span>
            {line}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-[#101828]/45">
        Sources: Toast POS · Restaurant365 · 7shifts · Paycor · Guest Feedback CRM
      </p>
    </Card>
  );
}

export function ReadinessCard() {
  const { derived: d, dispatch } = usePrive();
  const ready = d.readiness.score >= 85;
  return (
    <Card tone={ready ? "default" : "alert"}>
      <SectionTitle hint="Tomorrow">Readiness score</SectionTitle>
      <div className="flex items-end gap-3">
        <span className="text-5xl font-semibold tabular-nums">{d.readiness.score}%</span>
        <Pill tone={ready ? "teal" : "amber"}>{ready ? "Ready" : "Action required"}</Pill>
      </div>
      <div className="mt-3">
        <Meter value={d.readiness.score} tone={ready ? "teal" : "amber"} />
      </div>
      <ul className="mt-4 space-y-2">
        {d.readiness.risks.map((r) => (
          <li key={r.label} className="rounded-lg border border-[#101828]/8 bg-white px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{r.label}</span>
              <Pill tone={r.probability > 50 ? "red" : "amber"}>{r.probability}% risk</Pill>
            </div>
            <p className="mt-1 text-xs text-[#101828]/60">{r.detail}</p>
          </li>
        ))}
        {d.readiness.risks.length === 0 ? (
          <li className="rounded-lg border border-[#0F9D8A]/25 bg-[#0F9D8A]/6 px-3 py-2 text-sm text-[#0B7A6C]">
            No open risks — every tracked driver is inside tolerance.
          </li>
        ) : null}
      </ul>
      {/* The §50 WOW moment — GM asks "Can we handle tomorrow?" and Privé calculates the answer */}
      <button
        type="button"
        onClick={() => dispatch({ type: "askPriveTrigger", question: "Can we handle tomorrow?" })}
        className="mt-4 flex w-full items-center gap-2 rounded-lg border border-[#7C3AED]/25 bg-[#7C3AED]/[0.05] px-3 py-2.5 text-left text-sm font-medium text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/10"
      >
        <span className="text-[#7C3AED] opacity-70">✦</span>
        Ask Privé: &ldquo;Can we handle tomorrow?&rdquo;
      </button>
    </Card>
  );
}
