"use client";

import { useState } from "react";
import { CheckCircle, Gift } from "lucide-react";
import { Card, Pill, SectionTitle, PageTabs, PriveIntelBanner, Pagination } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

type Tab = "all" | "awaiting" | "resolved";

export default function GmGuestsPage() {
 const { derived: d, dispatch } = usePrive();
 const [activeTab, setActiveTab] = useState<Tab>("all");
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 4;

 const awaiting = d.gmComplaints.filter((c) => c.status === "Awaiting Approval");
 const resolved = d.gmComplaints.filter((c) => c.status === "Resolved" || c.status === "Rejected");

 const filteredComplaints = d.gmComplaints.filter((c) => {
  if (activeTab === "awaiting") return c.status === "Awaiting Approval";
  if (activeTab === "resolved") return c.status === "Resolved" || c.status === "Rejected";
  return true;
 });

 const totalPages = Math.ceil(filteredComplaints.length / pageSize);
 const paginatedComplaints = filteredComplaints.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 return (
  <>
   <div className="mb-8">
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#881337] mb-1.5">Customer Relations</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">Guest Complaint Center</h1>
    <p className="mt-2 max-w-3xl text-sm font-medium text-[#78716C]">
     Privé drafts guest responses and calculates recovery gift credits. No funds are issued without explicit GM approval.
    </p>
   </div>

   <PriveIntelBanner
    summary={`${awaiting.length} guest recovery draft(s) await GM approval. Privé has drafted responses and calculated single-use credits.`}
    details={[
     `Tomorrow's volume projects ${d.complaintForecast.expected} expected new complaint(s) (${d.complaintForecast.ratePer1000} per 1k transactions).`,
     "All recovery credits use cryptographic single-use tokens mapped to verified guest emails to prevent fraud.",
    ]}
   />

   <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Open Complaints</div>
     <div className={`text-3xl font-black tabular-nums ${d.gmComplaints.length > 0 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
      {d.gmComplaints.length}
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Total active items</div>
    </div>
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Awaiting Approval</div>
     <div className={`text-3xl font-black tabular-nums ${awaiting.length > 0 ? "text-[#B45309]" : "text-[#1C1917]"}`}>
      {awaiting.length}
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Guest recovery drafts</div>
    </div>
    <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
     <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-1">Resolved Today</div>
     <div className="text-3xl font-black tabular-nums text-[#15803D]">
      {resolved.length}
     </div>
     <div className="text-sm font-medium text-[#78716C] mt-1">Successfully handled</div>
    </div>
   </div>

   <PageTabs
    tabs={[
     { id: "all", label: "All Complaints" },
     { id: "awaiting", label: "Awaiting Approval", badge: awaiting.length },
     { id: "resolved", label: "Resolved / Cleared", badge: resolved.length },
    ]}
    active={activeTab}
    onChange={(tab) => {
     setActiveTab(tab as Tab);
     setCurrentPage(1);
    }}
   />

   <div className="space-y-6">
    <Card>
     <SectionTitle hint={`${filteredComplaints.length} Complaints`}>Guest Feedback Queue</SectionTitle>
     <div className="grid gap-6 sm:grid-cols-2">
      {paginatedComplaints.map((c) => (
       <div key={c.id} className={`rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5 shadow-sm space-y-4 flex flex-col justify-between ${
        c.status === "Awaiting Approval" ? "border-l-4" :
        c.status === "Resolved" ? "border-l-4" :
        "border-l-4"
       }`}>
        <div className="space-y-3">
         <div className="flex items-center justify-between gap-2 border-b border-[#E7E5E0] pb-3">
          <div>
           <span className="font-bold text-base text-[#1C1917]">{c.customer}</span>
           <span className="text-sm font-medium text-[#78716C] ml-2">· {c.type}</span>
          </div>
          <Pill tone={c.status === "Awaiting Approval" ? "amber" : c.status === "Resolved" ? "teal" : "red"}>
           {c.status}
          </Pill>
         </div>

         <p className="text-sm text-[#1C1917] font-medium italic">"{c.summary}"</p>

         <div className="rounded-xl bg-white/8 backdrop-blur-xl p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">Privé Drafted Response</span>
          <p className="text-sm text-[#44403C] font-medium">{c.draftResponse}</p>
          <div className="text-sm font-black text-[#15803D] pt-2">
           Recommended Credit: ${c.recommendedCredit}
          </div>
         </div>
        </div>

        {c.status === "Awaiting Approval" ? (
         <div className="flex flex-col gap-2 pt-3 border-t border-[#E7E5E0]">
          <button
           onClick={() => dispatch({ type: "resolveComplaint", id: c.id, amount: c.recommendedCredit })}
           className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
          >
           <Gift className="size-4" />
           Approve & Send ${c.recommendedCredit} Credit
          </button>
          <button
           onClick={() => dispatch({ type: "resolveComplaint", id: c.id, amount: 0 })}
           className="w-full rounded-lg bg-white/60 backdrop-blur-md px-4 py-3 text-sm font-bold text-[#1C1917] shadow-sm hover:bg-white/80 transition-all"
          >
           Apology Only (No Credit)
          </button>
         </div>
        ) : (
         <div className="text-sm font-bold text-[#15803D] flex items-center gap-2 pt-3 border-t border-[#E7E5E0]">
          <CheckCircle className="size-5" /> Complaint resolved & logged in CRM.
         </div>
        )}
       </div>
      ))}
     </div>

     <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      totalItems={filteredComplaints.length}
      pageSize={pageSize}
     />
    </Card>
   </div>
  </>
 );
}
