"use client";

import { useState } from "react";
import { CheckCircle, Gift } from "lucide-react";
import { Card, Pill, SectionTitle, PageTabs, PriveIntelBanner, Pagination, KpiRow } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

type Tab = "all" | "awaiting" | "resolved";

export default function GmGuestsPage() {
 const { derived: d, dispatch } = usePrive();
 const [activeTab, setActiveTab] = useState<Tab>("all");
 const [currentPage, setCurrentPage] = useState(1);
 const [approvedAt, setApprovedAt] = useState<Record<string, string>>({});
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
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Guest Complaint Center</h1>
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

   {/* 1-Click Batch Resolution Toolbar */}
   {awaiting.length > 0 && (
    <div className="mb-6 bg-[#FEF3C7] border border-[#B45309]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
     <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Batch Resolution Queue</div>
      <div className="text-base font-black text-[#1C1917]">{awaiting.length} Guest Recovery Drafts Pending GM Approval</div>
     </div>

     <button
      type="button"
      onClick={() => {
       awaiting.forEach((c) => {
           dispatch({ type: "resolveComplaint", id: c.id, amount: c.recommendedCredit });
           setApprovedAt(prev => ({ ...prev, [c.id]: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }));
       });
      }}
      className="rounded-xl bg-[#881337] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#6B0F2A] active:scale-95 transition-all shrink-0"
     >
      ✦ Approve All Drafts & Issue ${awaiting.reduce((sum, c) => sum + c.recommendedCredit, 0)} Total Credits
     </button>
    </div>
   )}

   <div className="mb-8 mt-6">
    <KpiRow
     items={[
      { label: "Open Complaints", value: d.gmComplaints.length, trend: d.gmComplaints.length > 0 ? "negative" : "positive" },
      { label: "Awaiting Approval", value: awaiting.length, trend: awaiting.length > 0 ? "negative" : "neutral" },
      { label: "Resolved Today", value: resolved.length, trend: "positive" },
     ]}
    />
   </div>

   {/* Complaint Trend — 7-Day Bar Chart */}
   <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] shadow-sm p-5">
    <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-5">
     <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">Complaint Trend</div>
      <div className="text-base font-black text-[#1C1917]">Guest Complaint Volume — Last 7 Days</div>
     </div>
     <div className="flex items-center gap-4 text-[11px] font-bold text-[#78716C]">
      <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-[#881337]" />Today</span>
      <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-[#B45309]/60" />Elevated</span>
      <span className="flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm bg-[#E7E5E0]" />Normal</span>
     </div>
    </div>
    {(() => {
     const days = [
      { day: "Mon", complaints: 2, resolved: 2 },
      { day: "Tue", complaints: 1, resolved: 1 },
      { day: "Wed", complaints: 4, resolved: 3 },
      { day: "Thu", complaints: 3, resolved: 2 },
      { day: "Fri", complaints: 5, resolved: 4 },
      { day: "Sat", complaints: 6, resolved: 3 },
      { day: "Today", complaints: d.gmComplaints.length, resolved: resolved.length },
     ];
     const max = Math.max(...days.map(d => d.complaints), 1);
     const avg = days.reduce((a, d) => a + d.complaints, 0) / days.length;
     const BAR_W = 48, GAP = 26, H = 100, PAD_L = 8;

     return (
      <div className="w-full overflow-x-auto">
       <svg viewBox={`0 0 ${days.length * (BAR_W + GAP) + PAD_L} ${H + 32}`} className="w-full" style={{ minWidth: 320 }}>
        {/* Avg reference line */}
        {(() => {
         const y = H - (avg / max) * H;
         return (
          <>
           <line x1={PAD_L} y1={y} x2={days.length * (BAR_W + GAP) + PAD_L} y2={y} stroke="#B45309" strokeWidth="1" strokeDasharray="4 3" />
           <text x={days.length * (BAR_W + GAP) + PAD_L + 2} y={y + 3.5} fontSize="8" fill="#B45309" fontWeight="700">Avg</text>
          </>
         );
        })()}
        {days.map((d, i) => {
         const x = PAD_L + i * (BAR_W + GAP);
         const barH = Math.max(4, (d.complaints / max) * H);
         const isToday = i === days.length - 1;
         const isElevated = d.complaints > avg && !isToday;
         const fill = isToday ? "#881337" : isElevated ? "#B45309" : "#D6D3D1";
         const resolvedH = Math.max(0, (d.resolved / max) * H);
         return (
          <g key={d.day}>
           {/* Background bar */}
           <rect x={x} y={0} width={BAR_W} height={H} fill="#F7F5F2" rx="4" />
           {/* Resolved portion (lighter) */}
           <rect x={x} y={H - resolvedH} width={BAR_W} height={resolvedH} fill={isToday ? "#881337" : "#D6D3D1"} rx="4" opacity="0.35" />
           {/* Complaint bar */}
           <rect x={x} y={H - barH} width={BAR_W} height={barH} fill={fill} rx="4" />
           {/* Count label */}
           <text x={x + BAR_W / 2} y={H - barH - 5} textAnchor="middle" fontSize="11" fontWeight="800" fill={fill}>{d.complaints}</text>
           {/* Day label */}
           <text x={x + BAR_W / 2} y={H + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill={isToday ? "#881337" : "#A8A29E"}>{d.day}</text>
           {/* Resolved label */}
           <text x={x + BAR_W / 2} y={H + 24} textAnchor="middle" fontSize="8" fill="#A8A29E">{d.resolved}✓</text>
          </g>
         );
        })}
       </svg>
      </div>
     );
    })()}
    <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-[#78716C]">
     <span className="font-bold text-[#881337]">Resolution Rate:</span>
     <span>{Math.round((resolved.length / Math.max(d.gmComplaints.length + resolved.length, 1)) * 100)}% this week</span>
     <span className="mx-1 text-[#E7E5E0]">·</span>
     <span>Avg response: <span className="font-bold text-[#1C1917]">47 min</span></span>
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
     <div className="flex flex-col">
      {paginatedComplaints.map((c) => (
       <div key={c.id} className={`border border-[#E7E5E0] rounded-xl p-4 mb-3 border-l-4 ${
        c.status === "Awaiting Approval" ? "border-l-[#B45309]" : "border-l-[#15803D]"
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

         <div className="mt-3 rounded-lg bg-[#F7F5F2] border border-[#E7E5E0] p-3 space-y-2">
           <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Privé Recommendation</div>
           <div className="text-sm text-[#1C1917] leading-relaxed">{c.draftResponse}</div>
           <div className="flex items-center justify-between pt-2 border-t border-[#F3F2F0]">
             <span className="text-xs font-bold text-[#15803D]">Recommended: ${c.recommendedCredit} credit</span>
             <span className="text-xs text-[#A8A29E]">94% confidence</span>
           </div>
         </div>
        </div>

        {c.status === "Awaiting Approval" ? (
         <div className="flex flex-col sm:flex-row gap-2 pt-4 mt-4 border-t border-[#E7E5E0]">
          <button
           onClick={() => {
               dispatch({ type: "resolveComplaint", id: c.id, amount: c.recommendedCredit });
               setApprovedAt(prev => ({ ...prev, [c.id]: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }));
           }}
           className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#6B0F2A] transition-all"
          >
           <Gift className="size-4" />
           Approve
          </button>
          <button
           className="flex-1 rounded-lg bg-white border border-[#E7E5E0] px-4 py-2 text-sm font-bold text-[#1C1917] shadow-sm hover:bg-[#F7F5F2] transition-all"
          >
           Edit
          </button>
          <button
           onClick={() => {
               dispatch({ type: "resolveComplaint", id: c.id, amount: 0 });
               setApprovedAt(prev => ({ ...prev, [c.id]: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }));
           }}
           className="flex-1 rounded-lg bg-white border border-[#E7E5E0] px-4 py-2 text-sm font-bold text-[#1C1917] shadow-sm hover:bg-[#F7F5F2] transition-all"
          >
           Apology Only
          </button>
         </div>
        ) : (
         <div className="text-sm font-bold text-[#15803D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 mt-4 border-t border-[#E7E5E0]">
          <span className="flex items-center gap-2"><CheckCircle className="size-5" /> Complaint resolved & logged in CRM.</span>
          {approvedAt[c.id] && (
            <div className="text-xs font-semibold text-[#15803D]">✓ Approved by Jordan Ellis · {approvedAt[c.id]}</div>
          )}
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
