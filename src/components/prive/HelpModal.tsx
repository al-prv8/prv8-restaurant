"use client";

import React from "react";
import {
  HelpCircle,
  X,
  Keyboard,
  BookOpen,
  Headphones,
  Sparkles,
  Command,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Mail,
} from "lucide-react";
import Link from "next/link";

export function HelpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white text-[#1C1917] shadow-2xl border border-[#E7E5E0] overflow-hidden z-10 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E7E5E0] bg-[#1C1917] text-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[#881337] text-white shadow-md">
              <HelpCircle className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Privé Operations Help & Knowledge Center
              </h2>
              <p className="text-xs text-white/60">
                Ballantyne #02 · General Manager Support Guide
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Keyboard Shortcuts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#881337]">
              <Keyboard className="size-4" />
              <span>Keyboard Shortcuts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Global Search</span>
                  <kbd className="rounded border border-[#E7E5E0] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#1C1917] shadow-xs">
                    ⌘ K
                  </kbd>
                </div>
                <p className="text-[11px] text-[#78716C]">
                  Find metrics, employee records, shift offers, and SOP documents.
                </p>
              </div>

              <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Toggle Sidebar</span>
                  <kbd className="rounded border border-[#E7E5E0] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#1C1917] shadow-xs">
                    ⌘ B
                  </kbd>
                </div>
                <p className="text-[11px] text-[#78716C]">
                  Collapse or expand sidebar to maximize canvas space.
                </p>
              </div>

              <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Ask Privé AI</span>
                  <span className="rounded bg-[#881337]/10 text-[#881337] px-1.5 py-0.5 text-[10px] font-bold">
                    ✦ Drawer
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C]">
                  Ask any question about sales curves, staffing gaps, or guest issues.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Quick Operations SOP Guides */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#881337]">
              <BookOpen className="size-4" />
              <span>Manager SOP Guides</span>
            </div>

            <div className="space-y-2">
              <div className="rounded-xl border border-[#E7E5E0] bg-white p-3.5 flex items-center justify-between gap-4 hover:bg-[#FAFAF8] transition-colors">
                <div>
                  <div className="text-xs font-bold text-[#1C1917]">
                    How to broadcast open shift pickup to qualified staff
                  </div>
                  <div className="text-[11px] text-[#78716C] mt-0.5">
                    Navigate to Scheduling &rarr; Master Roster &rarr; Click &quot;Broadcast Offer&quot;.
                  </div>
                </div>
                <Link
                  href="/gm/schedule"
                  onClick={onClose}
                  className="text-xs font-bold text-[#881337] hover:underline shrink-0"
                >
                  Go to Schedule &rarr;
                </Link>
              </div>

              <div className="rounded-xl border border-[#E7E5E0] bg-white p-3.5 flex items-center justify-between gap-4 hover:bg-[#FAFAF8] transition-colors">
                <div>
                  <div className="text-xs font-bold text-[#1C1917]">
                    Review & approve guest recovery credit requests
                  </div>
                  <div className="text-[11px] text-[#78716C] mt-0.5">
                    Navigate to Guest Issues &rarr; Click &quot;Approve Credit ($25.00)&quot; &rarr; Auto-issued to guest phone.
                  </div>
                </div>
                <Link
                  href="/gm/guests"
                  onClick={onClose}
                  className="text-xs font-bold text-[#881337] hover:underline shrink-0"
                >
                  Go to Guest Issues &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Section 3: 24/7 Operations Support */}
          <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-[#15803D] text-white">
                <Headphones className="size-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1C1917]">
                  Privé 24/7 Hospitality Operations Support
                </div>
                <div className="text-[11px] text-[#78716C]">
                  Dedicated hotline for General Managers & District Directors.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-xs font-bold">
              <a
                href="tel:18005557748"
                className="flex items-center gap-1.5 rounded-lg border border-[#E7E5E0] bg-white px-3 py-1.5 text-[#1C1917] hover:bg-[#E7E5E0]"
              >
                <PhoneCall className="size-3.5 text-[#15803D]" />
                <span>1-800-555-PRIVE</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#E7E5E0] bg-[#FAFAF8] px-6 py-3 flex items-center justify-between text-xs text-[#78716C]">
          <span>Privé Restaurant Intelligence v5.7 · Ballantyne #02</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[#1C1917] hover:underline"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
