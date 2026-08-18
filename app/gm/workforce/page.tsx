"use client";

import { Card, Pill, SectionTitle, PriveIntelBanner, KpiRow, DataTable, THead, Th, Tr, Td, StatusDot } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmWorkforcePage() {
 const { state, derived: d, dispatch } = usePrive();
 const wf = d.workforce;

 return (
  <>
   <div className="mb-8">
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Human Resources</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Workforce & Compliance</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
     Roster health, onboarding status, ServSafe certifications, and separation reviews for Ballantyne #02.
    </p>
   </div>

   <PriveIntelBanner
    summary={`Workforce roster operating at ${wf.active} active staff (${wf.trainingCompletionPct}% training completion). ${wf.trainingOverdue} overdue module(s).`}
    details={[
     `Separation Review: Jordan Smith (Turnover risk high, retention conversation recommended).`,
     `Certification Watch: 1 ServSafe certification expires within 14 days.`,
     `Average Tenure: ${wf.avgTenureMonths} months across all roles.`,
    ]}
   />

   <KpiRow
    items={[
     { label: "Team Size", value: String(wf.active), sub: "Active staff members", tone: "neutral" },
     { label: "Certifications Expiring", value: !state.certificationCompleted ? "1" : "0", sub: "Within the next 14 days", tone: !state.certificationCompleted ? "warn" : "good" },
     { label: "Training Completion", value: `${wf.trainingCompletionPct}%`, sub: `${wf.trainingOverdue} overdue modules`, tone: wf.trainingOverdue ? "warn" : "good" }
    ]}
   />

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="lg:col-span-6 space-y-6">
     <Card>
      <SectionTitle hint="45 Days Inactive">Employee Lifecycle, Inactivity Detection</SectionTitle>
      <div className="rounded-lg bg-[#FEF2F2] border border-[#B91C1C]/20 border-l-4 border-l-[#B91C1C] p-4 mb-4">
       <div className="text-xs font-bold uppercase tracking-wider text-[#B91C1C] mb-1">Inactivity Detected</div>
       <div className="text-sm font-semibold text-[#1C1917]">Jordan Smith has not worked a shift in 45 days.</div>
       <p className="text-xs text-[#78716C] mt-1">Privé recommends initiating a separation review or conducting a retention conversation. This employee is still on payroll.</p>
      </div>
      
      {!state.separationDecision ? (
       <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => dispatch({ type: "separation", decision: "Retain" })} className="flex-1 rounded-md bg-[#881337] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all">
         Initiate Retention Plan
        </button>
        <button onClick={() => dispatch({ type: "separation", decision: "Proceed" })} className="flex-1 rounded-md bg-white border border-[#E7E5E0] px-4 py-2.5 text-sm font-bold text-[#1C1917] hover:bg-[#F7F5F2] transition-all">
         Proceed with Separation
        </button>
       </div>
      ) : (
       <div className="text-xs font-semibold text-[#15803D] mt-2">
        Reviewed by Jordan Ellis · {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} · {state.separationDecision}
       </div>
      )}
     </Card>

     <Card>
      <SectionTitle hint="30 / 60 / 90 Day Watch">Compliance Timeline</SectionTitle>
      <DataTable>
       <THead>
        <tr><Th>Employee</Th><Th>Document</Th><Th>Status</Th><Th>Days Remaining</Th><Th>Warning</Th></tr>
       </THead>
       <tbody>
        <Tr>
         <Td><span className="font-semibold">Andre Vega</span></Td>
         <Td>Airport Badge</Td>
         <Td><div className="flex items-center"><StatusDot tone="amber" /> <span className="ml-1.5 text-xs">Expiring</span></div></Td>
         <Td className="tabular-nums">12 days</Td>
         <Td><Pill tone="amber">⚠ Action</Pill></Td>
        </Tr>
        <Tr>
         <Td><span className="font-semibold">Maya Robinson</span></Td>
         <Td>ServSafe Cert</Td>
         <Td>{state.certificationCompleted ? <div className="flex items-center"><StatusDot tone="green" /><span className="ml-1.5 text-xs">Current</span></div> : <div className="flex items-center"><StatusDot tone="amber" /><span className="ml-1.5 text-xs">Due Soon</span></div>}</Td>
         <Td className="tabular-nums">{state.certificationCompleted ? '180 days' : '14 days'}</Td>
         <Td>{state.certificationCompleted ? <Pill tone="teal">✓ OK</Pill> : <Pill tone="amber">Watch</Pill>}</Td>
        </Tr>
        <Tr>
         <Td><span className="font-semibold">Jordan Smith</span></Td>
         <Td>I-9 Verification</Td>
         <Td><div className="flex items-center"><StatusDot tone="green" /> <span className="ml-1.5 text-xs">Current</span></div></Td>
         <Td className="tabular-nums">180 days</Td>
         <Td><Pill tone="teal">✓ OK</Pill></Td>
        </Tr>
        <Tr>
         <Td><span className="font-semibold">Marcus Chen</span></Td>
         <Td>Food Handler Card</Td>
         <Td><div className="flex items-center"><StatusDot tone="green" /> <span className="ml-1.5 text-xs">Current</span></div></Td>
         <Td className="tabular-nums">63 days</Td>
         <Td><Pill tone="teal">✓ OK</Pill></Td>
        </Tr>
       </tbody>
      </DataTable>
     </Card>
    </div>

    <div className="lg:col-span-6 space-y-6">
     <Card>
      <SectionTitle hint="Compliance Watch">Certifications & I-9 Verification</SectionTitle>

      {/* Certification Expiry Countdown Timeline */}
      <div className="mb-4 rounded-xl bg-[#F7F5F2] border border-[#E7E5E0] p-4">
       <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-black text-[#1C1917]">ServSafe Renewal Timeline</span>
        <span className={state.certificationCompleted ? "text-xs font-bold text-[#15803D]" : "text-xs font-bold text-[#B45309]"}>
         {state.certificationCompleted ? "Renewed" : "14 Days Remaining"}
        </span>
       </div>
       <div className="w-full bg-[#E7E5E0] h-2 rounded-full overflow-hidden">
        <div
         className={`h-full transition-all duration-500 ${state.certificationCompleted ? "bg-[#15803D] w-full" : "bg-[#B45309] w-[35%]"}`}
        />
       </div>
      </div>

      <div className="space-y-1 mt-6">
       <div className="flex items-center justify-between border-b border-[#F3F2F0] py-3 text-sm">
        <span className="font-semibold text-[#1C1917]">ServSafe Food Handler (Maya Robinson)</span>
        <Pill tone={state.certificationCompleted ? "teal" : "amber"}>
         {state.certificationCompleted ? "Certified" : "Expires in 14 days"}
        </Pill>
       </div>
       <div className="flex items-center justify-between border-b border-[#F3F2F0] py-3 text-sm">
        <span className="font-semibold text-[#1C1917]">I-9 Employment Eligibility Verification</span>
        <Pill tone="teal">100% Verified</Pill>
       </div>
      </div>
     </Card>
    </div>
   </div>
  </>
 );
}
