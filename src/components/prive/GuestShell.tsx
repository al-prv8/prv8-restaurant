"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Gift, ChevronRight } from "lucide-react";

export function GuestShell({ children }: { children: ReactNode }) {
  const path = usePathname();

  const tabs = [
    { href: "/guest/service", label: "Contact Us", icon: Phone },
    { href: "/guest/credits", label: "My Credits", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-[#FFFEF9] text-[#1C1917]">

      {/* ── Consumer Top Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#E7E5E0] bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#881337]">
              <span className="text-[11px] font-black tracking-tight text-white">P</span>
            </div>
            <div>
              <div className="text-[13px] font-black tracking-tight text-[#1C1917]">Privé Guest</div>
              <div className="text-[10px] font-medium text-[#A8A29E]">The Morning Table · Ballantyne</div>
            </div>
          </div>

          {/* Hours badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#15803D]/10 px-3 py-1 text-[11px] font-bold text-[#15803D]">
            <span className="size-1.5 rounded-full bg-[#15803D] animate-pulse" />
            Open · 6 AM–10 PM
          </div>
        </div>

        {/* Tab nav */}
        <div className="mx-auto flex max-w-2xl items-center gap-0 border-t border-[#F3F2F0] px-4 sm:px-6">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-[12px] font-bold transition-colors ${
                  active
                    ? "border-[#881337] text-[#881337]"
                    : "border-transparent text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* ── Main content — centered, mobile-width ─────────────────────────── */}
      <main className="mx-auto max-w-2xl px-4 py-8 pb-24 sm:px-6">
        {children}
      </main>

      {/* ── Consumer Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#E7E5E0] bg-white py-6 text-center">
        <div className="mx-auto max-w-2xl px-4 space-y-1">
          <p className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-widest">Powered by Privé Guest Intelligence</p>
          <p className="text-[11px] text-[#A8A29E]">
            All conversations are recorded for quality assurance · Manager review required for all resolutions
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] font-medium text-[#78716C]">
            <Link href="/gm/home" className="flex items-center gap-1 hover:text-[#881337] transition-colors">
              Staff portal <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
