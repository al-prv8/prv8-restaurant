"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionTitle, Button, Pagination, KpiRow } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GuestCreditsPage() {
  const { state, dispatch } = usePrive();
  const liveComplaint = state.complaints.find((c) => c.id.startsWith("c-live-"));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const totalPages = Math.ceil(state.giftCredits.length / pageSize);
  const paginatedCredits = state.giftCredits.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalIssued = state.giftCredits.length;
  const totalRedeemed = state.giftCredits.filter(c => c.redeemed).length;
  const totalPending = totalIssued - totalRedeemed;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#1C1917]">Your Recovery Credits</h1>
        <p className="mt-1 text-sm text-[#78716C]">
          Single-use dining credits issued after your complaint was resolved — no expiry, no catch.
        </p>
      </div>


      <div className="mb-8">
        <KpiRow
          items={[
            { label: "Credits Issued", value: totalIssued },
            { label: "Redeemed", value: totalRedeemed, valueColor: "text-[#15803D]" },
            { label: "Pending Use", value: totalPending, valueColor: "text-[#B45309]" },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
            <SectionTitle hint={`${state.giftCredits.length} Issued`}>Your Active & Redeemed Credits</SectionTitle>
            {state.giftCredits.length === 0 ? (
              <div className="mt-6 rounded-xl bg-white border border-[#E7E5E0] p-10 text-center flex flex-col items-center justify-center">
                <h3 className="text-lg font-black text-[#1C1917] mb-2">No Credits Available</h3>
                <p className="text-sm font-medium text-[#78716C] max-w-sm mb-6">
                  {liveComplaint
                    ? "Your GM is currently reviewing your service case recommendation. You will be notified via email upon approval."
                    : "Simulate a guest call in Guest Service, then approve the recovery in the GM command center to see credits here."}
                </p>
                {!liveComplaint && (
                  <Link href="/guest/service">
                    <Button variant="primary" className="bg-[#881337] text-white hover:bg-[#881337]/90 font-bold px-6 py-2 border-none">Go to Guest Service</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {paginatedCredits.map((g) => (
                  <div key={g.code} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
                    <div>
                      <div className="flex flex-col gap-1 mb-2">
                        <span className="text-3xl font-black tracking-tight text-[#881337] tabular-nums">${g.amount}</span>
                        <span className="font-mono text-sm font-bold text-[#1C1917] tracking-widest">{g.code}</span>
                      </div>
                      <div className="text-xs font-medium text-[#78716C]">
                        Issued to {g.customer} · Expires: <span className="text-[#B91C1C] font-semibold">{g.expires}</span>
                      </div>
                    </div>
                    <Button
                      variant={g.redeemed ? "ghost" : "primary"}
                      disabled={g.redeemed}
                      onClick={() => dispatch({ type: "redeemCredit", code: g.code })}
                      className={g.redeemed ? "bg-[#F3F2F0] text-[#A8A29E] font-bold cursor-not-allowed border-none" : "bg-[#1C1917] text-white hover:bg-[#1C1917]/90 font-bold border-none"}
                    >
                      {g.redeemed ? "Redeemed" : "Redeem Now"}
                    </Button>
                  </div>
                ))}

                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={state.giftCredits.length}
                    pageSize={pageSize}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-xl bg-white border border-[#E7E5E0] p-5 shadow-sm">
            <SectionTitle>Credit Security & Rules</SectionTitle>
            <ul className="mt-4 space-y-4 text-sm font-medium text-[#44403C] leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-[#15803D] font-black text-lg leading-none mt-0.5">✓</span>
                <span>Single-use barcode issued directly to verified phone or email.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#15803D] font-black text-lg leading-none mt-0.5">✓</span>
                <span>Automatically synced with Toast POS checkout for instant redemption.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#15803D] font-black text-lg leading-none mt-0.5">✓</span>
                <span>Audit logged to prevent fraudulent re-issuance or duplicate redemption.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
