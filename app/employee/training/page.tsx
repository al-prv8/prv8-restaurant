"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, SectionTitle, Pill, Button } from "@/components/prive/ui";
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

   <div className="grid gap-4 sm:grid-cols-3 mb-8">
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
      <span className="text-sm font-bold text-[#78716C]">Modules Due</span>
      <span className="block text-2xl sm:text-3xl font-black tabular-nums text-[#1C1917] mt-1">{state.certificationCompleted ? "0" : "1"}</span>
     </div>
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
      <span className="text-sm font-bold text-[#78716C]">Expiring Certs</span>
      <span className="block text-2xl sm:text-3xl font-black tabular-nums text-[#B45309] mt-1">1</span>
     </div>
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
      <span className="text-sm font-bold text-[#78716C]">Completion</span>
      <span className="block text-2xl sm:text-3xl font-black tabular-nums text-[#15803D] mt-1">{state.certificationCompleted ? "100%" : "85%"}</span>
     </div>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-6 lg:col-span-7">
     <div className={`rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 `}>
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
           className={`w-full text-left p-3 rounded-xl text-sm font-semibold transition-all ${
            selectedAnswer === i
             ? "bg-[#881337]/10 text-[#881337] ring-1 ring-[#881337]/20"
             : "bg-white/60 backdrop-blur-sm text-[#44403C] hover:bg-white/80"
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

     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
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
      </div>
     </div>
    </div>

    <div className="space-y-6 lg:col-span-5">
     <div className="rounded-2xl bg-white/40 backdrop-blur-md shadow-md ring-1 ring-black/[0.04] p-5">
      <SectionTitle>Privé Training Assistant</SectionTitle>
      <p className="mt-3 text-sm font-medium leading-relaxed text-[#44403C]">
       Privé automatically tracks your certification expiry dates and alerts your manager 30 days before renewal.
      </p>
      <div className="mt-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-3 text-xs text-[#78716C] font-medium">
       Sources: NC Dept of Health · ServSafe Online · Privé LMS
      </div>
     </div>
    </div>
   </div>
  </>
 );
}
