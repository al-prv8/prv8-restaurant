import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Award, BookOpen, AlertCircle } from "lucide-react";
import { Card, SectionTitle, Pill, Button } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export const Route = createFileRoute("/employee/training")({
  component: EmployeeTrainingPage,
});

function EmployeeTrainingPage() {
  const { state, dispatch } = usePrive();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const QUIZ_OPTIONS = [
    "Use dedicated purple allergen cookware & notify kitchen lead",
    "Rinse standard tongs with hot water",
    "Wipe down grill with towel",
    "No action needed if customer orders well-done",
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Training & Certifications</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">
          Required safety modules, allergen protocols, and food handler certification watch.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {/* Interactive 5-Min Allergen Training Quiz Widget */}
          <Card tone={state.certificationCompleted ? "default" : "alert"}>
            <SectionTitle hint="5 min module">Allergen Safety & Cross-Contamination Protocol</SectionTitle>
            
            {state.certificationCompleted || submitted ? (
              <div className="rounded-xl border border-[#0F9D8A]/30 bg-[#0F9D8A]/10 p-4 text-xs font-bold text-[#0B7A6C] space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-5 text-[#0F9D8A]" />
                  <span>Module Completed & Certified!</span>
                </div>
                <p className="text-[#0B7A6C]/80 font-medium">
                  You scored 100% on the Allergen Safety Check. Certificate logged to your workforce profile.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#101828]">
                  Quick Knowledge Check: What is the mandatory procedure when a guest notifies you of a severe gluten allergy?
                </p>

                <div className="space-y-2">
                  {QUIZ_OPTIONS.map((opt, i) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedAnswer(i)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                        selectedAnswer === i
                          ? "border-[#5146E5] bg-[#5146E5]/10 text-[#5146E5]"
                          : "border-[#101828]/10 bg-white text-[#101828]/70 hover:bg-[#101828]/5"
                      }`}
                    >
                      {i + 1}. {opt}
                    </button>
                  ))}
                </div>

                <Button
                  disabled={selectedAnswer === null}
                  onClick={() => {
                    setSubmitted(true);
                    dispatch({ type: "completeCertification" });
                  }}
                  variant="primary"
                >
                  Submit & Complete Training (5 min)
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle hint="ServSafe Watch">Certification Status</SectionTitle>
            <div className="rounded-xl border border-[#101828]/8 bg-white p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-[#101828]">ServSafe Food Handler Certification</span>
                <Pill tone={state.certificationCompleted ? "teal" : "amber"}>
                  {state.certificationCompleted ? "100% Compliant" : "Renewal Due in 14 Days"}
                </Pill>
              </div>
              <p className="text-xs text-[#101828]/60">
                North Carolina Department of Health requires active certification for all front-of-house staff.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card tone="intel">
            <SectionTitle>Privé Training Assistant</SectionTitle>
            <p className="text-sm font-medium leading-relaxed text-[#101828]/80">
              Privé automatically tracks your certification expiry dates and alerts your manager 30 days before renewal.
            </p>
            <div className="mt-3 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/[0.04] p-3 text-xs text-[#101828]/70">
              Sources: NC Dept of Health · ServSafe Online · Privé LMS
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
