import { createFileRoute, Link } from "@tanstack/react-router";
import { Sun, Calendar, Clock, Award, ArrowRight } from "lucide-react";
import { Card, Metric, SectionTitle, Button, Pill } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";
import { MAYA } from "@/lib/prive/data";

export const Route = createFileRoute("/employee/home")({
  component: EmployeeHomePage,
});

function EmployeeHomePage() {
  const { state } = usePrive();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Good morning, {MAYA.name.split(" ")[0]} 👋</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Welcome to your employee portal at Ballantyne #02. Here is your daily shift overview.
        </p>
      </div>

      {/* Weather & Shift Tip Forecast Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#0F9D8A]/30 bg-[#0F9D8A]/10 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#0F9D8A] text-white shadow-xs">
            <Sun className="size-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#0B7A6C]">
              Sunny 74°F · High Patio & Dinner Traffic Forecast
            </div>
            <p className="text-xs font-medium text-[#0B7A6C]/80">
              High volume expected for your Section 3 shift — Tip velocity projected +18% above average!
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#0B7A6C]/15 border border-[#0B7A6C]/25 px-3 py-1 text-xs font-bold text-[#0B7A6C] shrink-0">
          Shift Tip Boost 🔥
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card tone="default">
            <SectionTitle hint="Today · Ballantyne #02">Shift Overview</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Shift starts" value="10:00 AM" sub="Ends 4:00 PM · Section 3" />
              <Metric label="Hours this week" value="28.5" sub="of 32 scheduled" />
              <Metric
                label="Training due"
                value="1 module"
                sub="Allergen Awareness (5 min)"
                tone="warn"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/employee/training"
                className="inline-flex items-center gap-2 rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#4238cf] transition-all"
              >
                Complete Allergen Training (5 min) <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </Card>

          <Card>
            <SectionTitle hint="Available to Pick Up">Open Shift Opportunities</SectionTitle>
            <div className="rounded-xl border border-[#101828]/8 bg-white p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-[#101828]">Saturday 4:00 PM – 8:00 PM</span>
                <Pill tone={state.shiftAccepted ? "teal" : "indigo"}>
                  {state.shiftAccepted ? "Interest Submitted" : "4.0 hrs · Qualified Server"}
                </Pill>
              </div>
              <p className="text-xs text-[#101828]/60">
                Peak dinner shift at Ballantyne #02. GM Jordan Ellis has broadcasted this shift for coverage.
              </p>
              <div className="pt-2">
                <Link
                  to="/employee/schedule"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5146E5] hover:underline"
                >
                  View Schedule & Express Interest <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card tone="intel">
            <SectionTitle>Privé Employee Assistant</SectionTitle>
            <p className="text-sm font-medium leading-relaxed text-[#101828]/80">
              Need help with restaurant policy, time off requests, or closing checklists? Ask Privé anytime using the floating AI button.
            </p>
            <div className="mt-3 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/[0.04] p-3 text-xs text-[#101828]/70">
              Sources: 7shifts · Privé Knowledge Base · ServSafe Certification Registry
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
