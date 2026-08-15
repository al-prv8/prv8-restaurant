import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, SectionTitle, Pagination } from "@/components/prive/ui";
import { AskPriveConsole } from "@/components/prive/AskPrive";
import { knowledge } from "@/lib/prive/data";

export const Route = createFileRoute("/employee/announcements")({
  head: () => ({ meta: [{ title: "Policy & Knowledge Base — Employee · Privé" }] }),
  component: EmployeeAnnouncementsPage,
});

function EmployeeAnnouncementsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const totalPages = Math.ceil(knowledge.length / pageSize);
  const paginatedKnowledge = knowledge.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Policy & Knowledge Base</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#101828]/60">Answers to common operational questions — no manager needed.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <SectionTitle hint={`${knowledge.length} Articles`}>Store Policies & Procedures</SectionTitle>
            <div className="space-y-3">
              {paginatedKnowledge.map((k) => (
                <details key={k.q} className="group rounded-xl border border-[#101828]/8 bg-white p-4 transition-all hover:border-[#101828]/15">
                  <summary className="cursor-pointer text-sm font-semibold text-[#101828] capitalize flex items-center justify-between">
                    <span>{k.q}</span>
                    <span className="text-xs text-[#5146E5] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-[#101828]/75 leading-relaxed">{k.a}</p>
                  <div className="mt-3 pt-2.5 border-t border-[#101828]/6 flex items-center justify-between text-[11px] text-[#101828]/45">
                    <span>Source: {k.source}</span>
                    <span className="text-[#0F9D8A] font-medium">Verified SOP</span>
                  </div>
                </details>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={knowledge.length}
              pageSize={pageSize}
            />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card tone="intel" className="lg:sticky lg:top-20 min-h-[500px]">
            <SectionTitle>Ask Privé AI Assistant</SectionTitle>
            <AskPriveConsole persona="employee" compact />
          </Card>
        </div>
      </div>
    </>
  );
}
