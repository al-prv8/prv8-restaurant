"use client";

import { Card, Pill, SectionTitle, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmWorkforcePage() {
 const { state, derived: d, dispatch } = usePrive();
 const wf = d.workforce;

 return (
  <>
   <div className="mb-8">
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Human Resources</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">Workforce & Compliance</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
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

   <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Team Size</div>
     <div className="text-3xl font-black tabular-nums text-[#1C1917]">{wf.active}</div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Active staff members</div>
    </div>
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Certifications Expiring</div>
     <div className={`text-3xl font-black tabular-nums ${!state.certificationCompleted ? "text-[#B45309]" : "text-[#15803D]"}`}>
      {!state.certificationCompleted ? "1" : "0"}
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Within the next 14 days</div>
    </div>
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Training Completion</div>
     <div className={`text-3xl font-black tabular-nums ${wf.trainingOverdue ? "text-[#B45309]" : "text-[#15803D]"}`}>
      {wf.trainingCompletionPct}%
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">{wf.trainingOverdue} overdue modules</div>
    </div>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="lg:col-span-6 space-y-6">
     <Card>
      <SectionTitle hint="Employee Separation">Separation Review</SectionTitle>
      <div className={`rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm space-y-3 ${!state.separationDecision ? "border-l-4" : "border-l-4"}`}>
       <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-lg text-[#1C1917]">Jordan Smith</span>
        <Pill tone={state.separationDecision ? "teal" : "red"}>
         {state.separationDecision ? state.separationDecision : "Action Needed"}
        </Pill>
       </div>
       <p className="text-sm font-medium text-[#78716C]">
        Role: Line Cook
        <br />
        Separation notice submitted. Privé recommends conducting an exit interview and evaluating retention bonus options.
       </p>
       {!state.separationDecision ? (
        <div className="pt-3 flex flex-col sm:flex-row gap-3 border-t border-[#E7E5E0]">
         <button onClick={() => dispatch({ type: "separation", decision: "Retain" })} className="flex-1 rounded-lg bg-[#881337] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all">
          Initiate Retention Plan
         </button>
         <button onClick={() => dispatch({ type: "separation", decision: "Proceed" })} className="flex-1 rounded-lg bg-white/60 backdrop-blur-md px-4 py-3 text-sm font-bold text-[#1C1917] shadow-sm hover:bg-white/80 transition-all">
          Proceed with Separation
         </button>
        </div>
       ) : null}
      </div>
     </Card>
    </div>

    <div className="lg:col-span-6 space-y-6">
     <Card>
      <SectionTitle hint="Compliance Watch">Certifications & I-9 Verification</SectionTitle>
      <div className="space-y-3">
       <div className="flex items-center justify-between rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 text-sm font-bold shadow-sm">
        <span className="text-[#1C1917]">ServSafe Food Handler (Maya Robinson)</span>
        <Pill tone={state.certificationCompleted ? "teal" : "amber"}>
         {state.certificationCompleted ? "Certified" : "Expires in 14 days"}
        </Pill>
       </div>
       <div className="flex items-center justify-between rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 text-sm font-bold shadow-sm">
        <span className="text-[#1C1917]">I-9 Employment Eligibility Verification</span>
        <Pill tone="teal">100% Verified</Pill>
       </div>
      </div>
     </Card>
    </div>
   </div>
  </>
 );
}
