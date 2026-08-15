import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { Card, SectionTitle, Button, Pill, Metric, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/employee/schedule")({
  head: () => ({ meta: [{ title: "Schedule & Open Shifts — Employee · Privé" }] }),
  component: EmployeeSchedulePage,
});

function EmployeeSchedulePage() {
  const { state, derived: d, dispatch } = usePrive();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const SHIFTS = [
    { day: "Today", time: "10:00 AM – 4:00 PM", role: "Section 3 · Server", hours: "6.0 hrs", status: "Confirmed", tone: "teal" as const },
    { day: "Friday", time: "11:00 AM – 5:00 PM", role: "Section 1 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
    { day: "Sunday", time: "10:00 AM – 4:00 PM", role: "Section 2 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
    { day: "Next Tuesday", time: "11:00 AM – 5:00 PM", role: "Section 4 · Server", hours: "6.0 hrs", status: "Scheduled", tone: "indigo" as const },
  ];

  if (state.shiftAccepted && state.extraStaffApproved > 0) {
    SHIFTS.splice(2, 0, {
      day: "Saturday",
      time: "4:00 PM – 8:00 PM",
      role: "Peak Block · Server",
      hours: "4.0 hrs",
      status: "Picked Up",
      tone: "teal" as const,
    });
  }

  const totalPages = Math.ceil(SHIFTS.length / pageSize);
  const paginatedShifts = SHIFTS.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Schedule & Open Shifts</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">Your upcoming shifts and open pickup opportunities at Ballantyne #02.</p>
      </div>

      <PriveIntelBanner
        summary={`You are scheduled for 28.5 hours this week ($441.75 est base pay). Saturday peak dinner shift is broadcasted.`}
        details={[
          `Saturday Peak Shift (4:00–8:00 PM): High transaction volume projected (+${d.tomorrow.vsTypicalPct}%).`,
          "Pickup requests notify GM Jordan Ellis via 7shifts for instant 1-click approval.",
        ]}
        action={!state.shiftAccepted ? () => dispatch({ type: "acceptShift" }) : undefined}
        actionLabel={!state.shiftAccepted ? "Express Interest in Saturday Shift" : undefined}
      />

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Weekly Scheduled" value="28.5 hrs" sub="Target: 32 hrs" />
          <Metric label="Estimated Pay" value="$441.75" sub="Base wage $15.50/hr" tone="good" />
          <Metric label="Shift Openings" value="1 Available" sub="Saturday 4–8 PM peak" tone="warn" />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6 space-y-6">
            <Card tone={state.shiftAccepted ? "default" : "alert"} className="h-full">
              <SectionTitle hint="Ballantyne #02 · Peak Demand">Open Shift Pickup Opportunity</SectionTitle>
              <p className="text-xs text-[#101828]/70 leading-relaxed font-medium">
                Saturday 4:00–8:00 PM · peak block. Privé forecasts <strong>{d.tomorrow.transactions.toLocaleString()} transactions</strong>{" "}
                tomorrow ({d.tomorrow.vsTypicalPct > 0 ? "+" : ""}
                {d.tomorrow.vsTypicalPct}% vs typical) and your manager is short {Math.max(d.staffing.gap, 1)} team member(s).
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button onClick={() => dispatch({ type: "acceptShift" })} disabled={state.shiftAccepted}>
                  {state.shiftAccepted ? "Interest Submitted" : "I'm Interested"}
                </Button>
                {state.shiftAccepted ? (
                  <Pill tone={state.extraStaffApproved > 0 ? "teal" : "amber"}>
                    {state.extraStaffApproved > 0 ? "Approved by GM — on schedule" : "Waiting on GM approval"}
                  </Pill>
                ) : (
                  <span className="text-xs font-semibold text-[#101828]/60">Approx. 4.0 hrs · $15.50/hr · Server</span>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <Card className="h-full">
              <SectionTitle hint={`${SHIFTS.length} Shifts`}>Scheduled Shifts</SectionTitle>
              <div className="space-y-2.5">
                {paginatedShifts.map((s) => (
                  <div key={s.day} className="flex items-center justify-between rounded-xl border border-[#101828]/8 bg-white p-3.5 text-xs shadow-xs">
                    <div>
                      <div className="font-bold text-sm text-[#101828]">{s.day} · {s.time}</div>
                      <div className="text-xs font-semibold text-[#101828]/50 mt-0.5">{s.role} · {s.hours}</div>
                    </div>
                    <Pill tone={s.tone}>{s.status}</Pill>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={SHIFTS.length}
                pageSize={pageSize}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
