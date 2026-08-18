"use client";

import { useState } from "react";
import { Search, Tag, CheckCircle2 } from "lucide-react";
import { Card, SectionTitle, Pagination, PriveIntelBanner } from "@/components/prive/ui";
import { AskPriveConsole } from "@/components/prive/AskPrive";
import { knowledge } from "@/lib/prive/data";

export default function EmployeeAnnouncementsPage() {
 const [searchQuery, setSearchQuery] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 4;

 const filteredKnowledge = knowledge.filter(
  (k) =>
   k.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
   k.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
   k.source.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const totalPages = Math.ceil(filteredKnowledge.length / pageSize);
 const paginatedKnowledge = filteredKnowledge.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 const TAGS = ["Allergen", "Shift Swap", "Uniform", "Sick Leave", "Tips"];

 return (
  <>
   <div className="mb-8 space-y-1">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337]">Ballantyne #02 · Policy & Knowledge Base</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Announcements & Policies</h1>
    <p className="text-sm font-medium text-[#78716C]">Answers to common operational questions, no manager needed.</p>
   </div>

   <PriveIntelBanner
    summary="2 policy updates require your acknowledgment before your next shift: updated allergen handling and uniform guidelines."
    details={[
     "Allergen Awareness: new tree nut cross-contamination protocol effective immediately.",
     "Shift swap policy updated — all requests now require 48 hours advance notice.",
     "Ask Privé below for instant answers to any policy question at any time.",
    ]}
   />

   {/* Interactive Knowledge Base Q&A Search Engine */}
   <div className="mb-6 rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
    <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-3 mb-4">
     <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337]">SOP Search Engine</div>
      <div className="text-base font-black text-[#1C1917]">Store Knowledge Base & Employee Handbook</div>
     </div>
     <span className="text-xs font-bold text-[#15803D] bg-[#15803D]/10 px-3 py-1 rounded-full">
      {filteredKnowledge.length} SOPs Found
     </span>
    </div>

    <div className="relative mb-3">
     <Search className="absolute left-3.5 top-3.5 size-4 text-[#A8A29E]" />
     <input
      type="text"
      value={searchQuery}
      onChange={(e) => {
       setSearchQuery(e.target.value);
       setCurrentPage(1);
      }}
      placeholder="Search policies (e.g. allergen, uniform, sick leave, overtime)..."
      className="w-full rounded-xl bg-[#F7F5F2] border border-[#E7E5E0] pl-10 pr-4 py-3 text-xs font-bold text-[#1C1917] outline-none placeholder-[#A8A29E] focus:ring-2 focus:ring-[#881337]"
     />
    </div>

    {/* Quick Tag Chips */}
    <div className="flex flex-wrap items-center gap-2">
     <span className="text-[10px] font-bold uppercase text-[#A8A29E] flex items-center gap-1">
      <Tag className="size-3" /> Quick Filter:
     </span>
     {TAGS.map((tag) => (
      <button
       key={tag}
       type="button"
       onClick={() => {
        setSearchQuery(tag);
        setCurrentPage(1);
       }}
       className={`rounded-md px-2.5 py-1 text-[11px] font-semibold border transition-all ${
        searchQuery.toLowerCase() === tag.toLowerCase()
         ? "bg-[#881337] text-white border-[#881337]"
         : "border-[#E7E5E0] bg-white text-[#78716C] hover:bg-[#F7F5F2]"
       }`}
      >
       #{tag}
      </button>
     ))}
     {searchQuery ? (
      <button
       type="button"
       onClick={() => setSearchQuery("")}
       className="text-[11px] font-bold text-[#B91C1C] hover:underline ml-2"
      >
       Clear Filter
      </button>
     ) : null}
    </div>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-6 lg:col-span-7">
     <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
      <SectionTitle hint={`${filteredKnowledge.length} Articles`}>Store Policies & Procedures</SectionTitle>

      {filteredKnowledge.length === 0 ? (
       <div className="mt-6 rounded-lg bg-[#F7F5F2] border border-[#E7E5E0] p-8 text-center text-sm font-medium text-[#78716C]">
        No policies found matching &ldquo;{searchQuery}&rdquo;. Try searching with Ask Privé AI on the right!
       </div>
      ) : (
       <div className="mt-4 space-y-4">
        {paginatedKnowledge.map((k) => (
         <details key={k.q} open className="group rounded-lg border border-[#E7E5E0] bg-white p-4 transition-all shadow-sm">
          <summary className="cursor-pointer text-sm font-black text-[#1C1917] flex items-center justify-between outline-none">
           <span>{k.q}</span>
           <span className="text-xs text-[#881337] font-bold group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-4 pt-4 border-t border-[#E7E5E0]">
           <p className="text-sm text-[#44403C] leading-relaxed font-medium">{k.a}</p>
           <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
            <span>Source: {k.source}</span>
            <span className="text-[#15803D] flex items-center gap-1"><CheckCircle2 className="size-3" /> Verified SOP</span>
           </div>
          </div>
         </details>
        ))}
       </div>
      )}

      {filteredKnowledge.length > 0 && (
       <div className="mt-6">
        <Pagination
         currentPage={currentPage}
         totalPages={totalPages}
         onPageChange={setCurrentPage}
         totalItems={filteredKnowledge.length}
         pageSize={pageSize}
        />
       </div>
      )}
     </div>
    </div>

    <div className="space-y-6 lg:col-span-5">
     <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm lg:sticky lg:top-20 min-h-[500px]">
      <SectionTitle>Ask Privé AI Assistant</SectionTitle>
      <div className="mt-4">
       <AskPriveConsole persona="employee" compact />
      </div>
     </div>
    </div>
   </div>
  </>
 );
}
