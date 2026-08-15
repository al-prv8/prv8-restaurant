import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Card, Metric, Pill, SectionTitle, Button, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { money } from "@/lib/prive/forecast";

export const Route = createFileRoute("/gm/staffing")({
  head: () => ({ meta: [{ title: "Staffing — GM · Privé" }] }),
  component: GmStaffing,
});

export function GmStaffing() {
  const { state, derived: d, dispatch } = usePrive();
  const s = d.staffing;

  const HOURLY_COVERAGE = [
    { time: "10 AM", scheduled: 4, recommended: 4, peak: false },
    { time: "12 PM", scheduled: 8, recommended: 8, peak: true },
    { time: "2 PM", scheduled: 6, recommended: 6, peak: false },
    { time: "4 PM", scheduled: 5, recommended: 7, peak: true, gap: true },
    { time: "6 PM", scheduled: 6, recommended: 8, peak: true, gap: true },
    { time: "8 PM", scheduled: 5, recommended: 5, peak: false },
    { time: "10 PM", scheduled: 3, recommended: 3, peak: false },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Staffing & Labor Coverage</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Labor forecast against peak transaction volume — recommended vs scheduled staffing levels.
        </p>
      </div>

      <PriveIntelBanner
        summary={
          s.gap > 0
            ? `Staffing is ${s.gap} role(s) short during Saturday 4:00 PM – 8:00 PM dinner peak.`
            : "Staffing coverage is fully balanced against peak transaction volume."
        }
        details={[
          `Labor Projected: ${s.projectedLaborPct}% of sales against ${s.targetLaborPct}% target (${money(s.projectedLaborCost)}).`,
          `Scheduled Staff: ${s.scheduledStaff} vs recommended ${s.recommendedStaff} (${s.laborHoursNeeded} labor hours).`,
          "Stagger closing shift out-times to eliminate 14 overtime hours.",
        ]}
        action={s.gap > 0 ? () => dispatch({ type: "sendShiftOffer" }) : undefined}
        actionLabel={s.gap > 0 ? "Broadcast Shift Opportunity" : undefined}
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric
            label="Staffing Gap"
            value={s.gap > 0 ? `${s.gap} roles` : "Covered"}
            sub={s.gap > 0 ? "Peak block Saturday 4–8 PM" : "Optimal coverage"}
            tone={s.gap > 0 ? "warn" : "good"}
          />
          <Metric
            label="Projected Labor"
            value={`${s.projectedLaborPct}%`}
            sub={`Target: ${s.targetLaborPct}% · ${money(s.projectedLaborCost)}`}
            tone={s.projectedLaborPct > s.targetLaborPct ? "warn" : "good"}
          />
          <Metric
            label="Labor Hours"
            value={`${s.laborHoursNeeded} hrs`}
            sub={`Scheduled: ${s.scheduledStaff} · Need: ${s.recommendedStaff}`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Peak Hour Shift Coverage Timeline Bar */}
          <div className="lg:col-span-6">
            <Card className="h-full">
              <SectionTitle hint="Saturday Peak Distribution">Hourly Staffing Coverage Timeline</SectionTitle>
              <div className="space-y-3">
                {HOURLY_COVERAGE.map((h) => (
                  <div key={h.time} className="flex items-center justify-between gap-3 text-xs font-semibold">
                    <span className="w-12 text-[#101828]/60">{h.time}</span>
                    <div className="flex-1 h-3 rounded-full bg-[#101828]/8 overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all ${
                          h.gap && s.gap > 0 ? "bg-[#F59E0B]" : "bg-[#5146E5]"
                        }`}
                        style={{ width: `${(h.scheduled / 10) * 100}%` }}
                      />
                    </div>
                    <span className="w-24 text-right tabular-nums">
                      {h.scheduled} / {h.recommended} staff
                      {h.gap && s.gap > 0 ? <span className="text-[#92400E] font-bold ml-1">(-{s.gap})</span> : null}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6">
            <Card className="h-full">
              <SectionTitle hint="Shift Opportunities">Saturday Peak Broadcast (4:00 PM – 8:00 PM)</SectionTitle>
              <div className="space-y-3">
                <div className="rounded-xl border border-[#101828]/8 bg-white p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-[#101828]">Saturday Peak Shift (4:00 PM – 8:00 PM)</span>
                    <Pill tone={state.shiftOfferSent ? "teal" : "amber"}>
                      {state.shiftOfferSent ? "Broadcast Active" : "Action Required"}
                    </Pill>
                  </div>
                  <p className="text-xs text-[#101828]/60">
                    {state.shiftOfferSent
                      ? "Broadcast sent to 4 qualified servers. Maya Robinson has expressed interest."
                      : "1 shift gap identified for Saturday peak dinner rush. Broadcast opportunity to qualified team members."}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {!state.shiftOfferSent ? (
                      <Button onClick={() => dispatch({ type: "sendShiftOffer" })}>
                        Broadcast Shift Opportunity
                      </Button>
                    ) : null}

                    {state.shiftAccepted && state.extraStaffApproved < 2 ? (
                      <Button variant="violet" onClick={() => dispatch({ type: "approveStaffing" })}>
                        Approve Maya Robinson's Shift
                      </Button>
                    ) : null}

                    {state.extraStaffApproved >= 2 ? (
                      <div className="text-xs font-bold text-[#0B7A6C] flex items-center gap-1.5">
                        <CheckCircle2 className="size-4" /> Shift coverage approved & added to 7shifts schedule!
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
