import { createFileRoute } from "@tanstack/react-router";
import { Users, GraduationCap, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, Metric, Pill, SectionTitle, Button, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/gm/workforce")({
  head: () => ({ meta: [{ title: "Workforce — GM · Privé" }] }),
  component: GmWorkforce,
});

function GmWorkforce() {
  const { state, derived: d, dispatch } = usePrive();
  const wf = d.workforce;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Workforce & Compliance</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Roster health, onboarding status, ServSafe certifications, and separation reviews for Ballantyne #02.
        </p>
      </div>

      <PriveIntelBanner
        summary={`Workforce roster operating at ${wf.active} active staff (${wf.trainingCompletionPct}% training completion). ${wf.trainingOverdue} overdue module(s).`}
        details={[
          `Separation Review: Jordan Smith (Turnover risk high — retention conversation recommended).`,
          `Certification Watch: 1 ServSafe certification expires within 14 days.`,
          `Average Tenure: ${wf.avgTenureMonths} months across all roles.`,
        ]}
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Active Roster" value={`${wf.active}`} sub={`${wf.onboarding} onboarding · ${wf.onLeave} on leave`} tone="good" />
          <Metric label="Training Completion" value={`${wf.trainingCompletionPct}%`} sub={`${wf.trainingOverdue} overdue module(s)`} tone={wf.trainingOverdue ? "warn" : "good"} />
          <Metric label="Avg Tenure" value={`${wf.avgTenureMonths} mo`} sub="Across FOH & BOH staff" />
          <Metric label="Open Roles" value={`${wf.openRoles}`} sub="Active job requisitions" />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6 space-y-6">
            <Card>
              <SectionTitle hint="Employee Separation">Separation Review — Jordan Smith</SectionTitle>
              <div className="rounded-xl border border-[#101828]/8 bg-white p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#101828]">Jordan Smith (Line Cook)</span>
                  <Pill tone={state.separationDecision ? "teal" : "red"}>
                    {state.separationDecision ? state.separationDecision : "Action Needed"}
                  </Pill>
                </div>
                <p className="text-xs text-[#101828]/60">
                  Separation notice submitted. Privé recommends conducting an exit interview and evaluating retention bonus options.
                </p>
                {!state.separationDecision ? (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Button onClick={() => dispatch({ type: "separationDecision", decision: "Retain" })} className="py-1 px-3 text-xs">
                      Initiate Retention Plan
                    </Button>
                    <Button variant="ghost" onClick={() => dispatch({ type: "separationDecision", decision: "Proceed" })} className="py-1 px-3 text-xs">
                      Proceed with Separation
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <Card>
              <SectionTitle hint="Compliance Watch">Certifications & I-9 Verification</SectionTitle>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[#101828]/8 bg-white p-3.5 text-xs font-semibold">
                  <span>ServSafe Food Handler (Maya Robinson)</span>
                  <Pill tone={state.certificationCompleted ? "teal" : "amber"}>
                    {state.certificationCompleted ? "Certified" : "Expires in 14 days"}
                  </Pill>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#101828]/8 bg-white p-3.5 text-xs font-semibold">
                  <span>I-9 Employment Eligibility Verification</span>
                  <Pill tone="teal">100% Verified</Pill>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
