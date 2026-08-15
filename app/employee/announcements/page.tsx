"use client";

import { useState } from "react";
import { Card, SectionTitle, Pagination } from "@/components/prive/ui";
import { AskPriveConsole } from "@/components/prive/AskPrive";
import { knowledge } from "@/lib/prive/data";

export default function EmployeeAnnouncementsPage() {
 const [currentPage, setCurrentPage] = useState(1);
 const pageSize = 3;

 const totalPages = Math.ceil(knowledge.length / pageSize);
 const paginatedKnowledge = knowledge.slice((currentPage - 1) * pageSize, currentPage * pageSize);

 return (
  <>
   <div className="mb-8 space-y-1">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337]">Ballantyne #02 · Policy & Knowledge Base</p>
    <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">Announcements & Policies</h1>
    <p className="text-sm font-medium text-[#78716C]">Answers to common operational questions — no manager needed.</p>
   </div>

   <div className="grid gap-6 lg:grid-cols-12">
    <div className="space-y-6 lg:col-span-7">
     <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
      <SectionTitle hint={`${knowledge.length} Articles`}>Store Policies & Procedures</SectionTitle>
      <div className="mt-4 space-y-4">
       {paginatedKnowledge.map((k) => (
        <details key={k.q} className="group rounded-2xl bg-white/40 backdrop-blur-sm shadow-sm ring-1 ring-black/[0.04] p-5 transition-all shadow-sm">
         <summary className="cursor-pointer text-sm font-black text-[#1C1917] flex items-center justify-between outline-none">
          <span>{k.q}</span>
          <span className="text-xs text-[#881337] font-bold group-open:rotate-180 transition-transform">▼</span>
         </summary>
         <div className="mt-4 pt-4 border-t border-[#E7E5E0]">
          <p className="text-sm text-[#44403C] leading-relaxed font-medium">{k.a}</p>
          <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider">
           <span>Source: {k.source}</span>
           <span className="text-[#15803D]">Verified SOP</span>
          </div>
         </div>
        </details>
       ))}
      </div>

      <div className="mt-6">
       <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={knowledge.length}
        pageSize={pageSize}
       />
      </div>
     </div>
    </div>

    <div className="space-y-6 lg:col-span-5">
     <div className="rounded-2xl bg-white/40 backdrop-blur-md shadow-md ring-1 ring-black/[0.04] p-5 lg:sticky lg:top-20 min-h-[500px]">
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
