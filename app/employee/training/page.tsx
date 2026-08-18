"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, SectionTitle, Pill, Button, KpiRow, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function EmployeeTrainingPage() {
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
   <div className="mb-8 space-y-1">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337]">Ballantyne #02 · Learning & Compliance</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Training & Certifications</h1>
    <p className="text-sm font-medium text-[#78716C]">Required safety modules, allergen protocols, and food handler certification watch.</p>
   </div>

   {/* Learning Progress Bar & Quiz Streak Badge */}
   <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
    <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-4">
     <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Maya's Learning Path</div>
      <div className="text-base font-black text-[#1C1917]">Compliance & Safety Training Progress</div>
     </div>
     <Pill tone={state.certificationCompleted ? "teal" : "amber"}>
      {state.certificationCompleted ? "100% Certified" : "85% Progress"}
     </Pill>
    </div>

    <div className="space-y-3">
     <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
      <span>Course Completion: {state.certificationCompleted ? "6 of 6 Modules" : "5 of 6 Modules"}</span>
      <span className="text-[#15803D]">🔥 12-Day Quiz Streak</span>
     </div>

     <div className="w-full bg-[#E7E5E0] h-2.5 rounded-full overflow-hidden">
      <div
       className="bg-[#15803D] h-full transition-all duration-500 rounded-full"
       style={{ width: state.certificationCompleted ? "100%" : "85%" }}
      />
     </div>
    </div>
   </div>

   <div className="mb-8">
     <KpiRow items={[
       { label: "Modules Due", value: state.certificationCompleted ? "0" : "1" },
       { label: "Expiring Certs", value: "1", tone: "warn" },
       { label: "Completion", value: state.certificationCompleted ? "100%" : "85%", tone: "good" }
     ]} />
   </div>

   <PriveIntelBanner
    summary={state.certificationCompleted
     ? "All training modules complete. Your certification is current and your profile is fully compliant."
     : "Allergen Awareness training is due before your next shift. It takes 5 minutes and keeps your certification active."
    }
    details={[
     "ServSafe Food Handler certification expires within 14 days. Complete the renewal before your next shift.",
     "Your overall training completion rate is 85%. Completing one module brings you to 100%.",
    ]}
   />

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-6 lg:col-span-7">
     <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
      <SectionTitle hint="5 min module">Allergen Safety & Cross-Contamination Protocol</SectionTitle>
      
      {state.certificationCompleted || submitted ? (
       <div className="mt-4 rounded-xl bg-[#15803D]/10 p-4 text-xs font-bold text-[#15803D] space-y-2">
        <div className="flex items-center gap-2 text-sm">
         <CheckCircle2 className="size-5 text-[#15803D]" />
         <span>Module Completed & Certified!</span>
        </div>
        <p className="text-[#15803D]/80 font-medium">
         You scored 100% on the Allergen Safety Check. Certificate logged to your workforce profile.
        </p>
       </div>
      ) : (
       <div className="mt-4 space-y-5">
        <p className="text-sm font-bold text-[#1C1917]">
         Quick Knowledge Check: What is the mandatory procedure when a guest notifies you of a severe gluten allergy?
        </p>

        <div className="space-y-2">
         {QUIZ_OPTIONS.map((opt, i) => (
          <button
           key={opt}
           type="button"
           onClick={() => setSelectedAnswer(i)}
           className={`w-full text-left p-3 rounded-lg border text-sm font-semibold transition-all ${
            selectedAnswer === i
             ? "bg-[#FFF8F6] border-[#881337]/30 text-[#881337]"
             : "bg-white border-[#E7E5E0] text-[#44403C] hover:bg-[#F7F5F2]"
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
         className="w-full bg-[#881337] text-white hover:bg-[#881337]/90 py-3 text-sm font-bold border-none"
        >
         Start Module & Submit (5 min)
        </Button>
       </div>
      )}
     </div>

     <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
      <SectionTitle hint="ServSafe Watch">Certification Status</SectionTitle>
      <div className="mt-4 space-y-3">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="font-bold text-sm text-[#1C1917]">ServSafe Food Handler Certification</span>
        <Pill tone={state.certificationCompleted ? "teal" : "amber"}>
         {state.certificationCompleted ? "100% Compliant" : "Renewal Due in 14 Days"}
        </Pill>
       </div>
       <p className="text-sm text-[#78716C] font-medium leading-relaxed">
        North Carolina Department of Health requires active certification for all front-of-house staff.
       </p>
       <div className="mt-4 border-t border-[#E7E5E0] pt-4 flex gap-4">
         <div className="flex-1">
           <div className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mb-1">30 Days</div>
           <div className="h-1.5 w-full bg-[#15803D] rounded-full"></div>
         </div>
         <div className="flex-1">
           <div className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mb-1">60 Days</div>
           <div className="h-1.5 w-full bg-[#E7E5E0] rounded-full"></div>
         </div>
         <div className="flex-1">
           <div className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mb-1">90 Days</div>
           <div className="h-1.5 w-full bg-[#E7E5E0] rounded-full"></div>
         </div>
       </div>
      </div>
     </div>
    </div>

    <div className="space-y-6 lg:col-span-5">
     <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
      <SectionTitle>Privé Training Assistant</SectionTitle>
      <p className="mt-3 text-sm font-medium leading-relaxed text-[#44403C]">
       Privé automatically tracks your certification expiry dates and alerts your manager 30 days before renewal.
      </p>
      <div className="mt-4 rounded-lg bg-[#F7F5F2] border border-[#E7E5E0] p-3 text-xs text-[#78716C] font-medium">
       Sources: NC Dept of Health · ServSafe Online · Privé LMS
      </div>
     </div>
    </div>
   </div>
  </>
 );
}
