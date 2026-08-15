import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Card, Pill, SectionTitle, Meter, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/gm/facility")({
  head: () => ({ meta: [{ title: "Facility — GM · Privé" }] }),
  component: GmFacility,
});

function GmFacility() {
  const { derived: d } = usePrive();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Facility Readiness</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Readiness scores and outstanding cleaning or maintenance tasks for Ballantyne #02.
        </p>
      </div>

      <PriveIntelBanner
        summary={`Facility readiness score is ${d.facility.score}%. Kitchen (${d.facility.detail.kitchen}%), Restrooms (${d.facility.detail.restrooms}%).`}
        details={[
          "Overdue Task: Hood & vent cleaning (overdue by 2 days).",
          "Overdue Task: Mid-day restroom check (missed 11:00 AM slot).",
          "Health inspection audit risk currently low (92% pass probability).",
        ]}
      />

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6 space-y-6">
            <Card>
              <SectionTitle hint={`${d.facility.score}% overall`}>Area Readiness Scores</SectionTitle>
              <Meter value={d.facility.score} tone={d.facility.score >= 90 ? "teal" : "amber"} />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {Object.entries(d.facility.detail).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-xl border border-[#101828]/8 bg-white px-3 py-2.5 shadow-xs"
                  >
                    <span className="text-xs font-semibold capitalize text-[#101828]/70">{k}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#101828]/8">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${v}%`, background: v >= 90 ? "#0F9D8A" : "#F59E0B" }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-bold tabular-nums">{v}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <Card>
              <SectionTitle hint={`${d.facility.tasks.length} items`}>Cleaning & Maintenance Schedule</SectionTitle>
              <div className="space-y-2.5">
                {d.facility.tasks.map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center justify-between gap-2 rounded-xl border border-[#101828]/8 bg-white px-3.5 py-3 text-xs shadow-xs"
                  >
                    <span className="font-semibold text-[#101828]">{t.label}</span>
                    <Pill tone={t.state === "overdue" ? "red" : t.state === "due" ? "amber" : "neutral"}>
                      {t.due}
                    </Pill>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
