"use client";

import React from "react";
import {
  User,
  X,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Calendar,
  LogOut,
  ExternalLink,
  Award,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrive } from "@/lib/prive/store";

export function ProfileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { state, dispatch } = usePrive();

  if (!open) return null;

  const handleLogout = () => {
    dispatch({ type: "logout" });
    onClose();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md bg-white text-[#1C1917] shadow-2xl flex flex-col border-l border-[#E7E5E0]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E7E5E0] bg-[#1C1917] text-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="relative grid size-12 shrink-0 place-items-center rounded-full bg-[#881337] text-white font-black text-lg border-2 border-white/20">
                JE
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#4ADE80] ring-2 ring-[#1C1917]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">
                  Jordan Ellis
                </h2>
                <p className="text-xs text-white/60">
                  General Manager · Ballantyne #02
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Account Info Card */}
            <div className="rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] p-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#881337]">
                Manager Account Details
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] font-semibold">Employee ID:</span>
                  <span className="font-bold text-[#1C1917] font-mono">EMP-4092</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] font-semibold">Email:</span>
                  <span className="font-bold text-[#1C1917]">jordan.ellis@themorningtable.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] font-semibold">Store:</span>
                  <span className="font-bold text-[#1C1917]">Ballantyne #02 (Charlotte, NC)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#78716C] font-semibold">Tenure:</span>
                  <span className="font-bold text-[#1C1917]">4 Years 8 Months</span>
                </div>
              </div>
            </div>

            {/* Manager Permissions List */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#881337]">
                Active Manager Permissions
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#15803D] font-bold">
                  <CheckCircle2 className="size-4" />
                  <span>Full Operational & Financial Oversight</span>
                </div>
                <div className="flex items-center gap-2 text-[#15803D] font-bold">
                  <CheckCircle2 className="size-4" />
                  <span>Bi-Weekly Payroll Sign-Off Authority ($25,000 cap)</span>
                </div>
                <div className="flex items-center gap-2 text-[#15803D] font-bold">
                  <CheckCircle2 className="size-4" />
                  <span>Open Shift Broadcast & Emergency Staffing Approval</span>
                </div>
                <div className="flex items-center gap-2 text-[#15803D] font-bold">
                  <CheckCircle2 className="size-4" />
                  <span>Guest Complaint Resolution & Recovery Credit Issuance</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <Link
                href="/gm/workforce"
                onClick={onClose}
                className="flex items-center justify-between rounded-xl border border-[#E7E5E0] bg-white p-3 text-xs font-bold text-[#1C1917] hover:bg-[#FAFAF8] transition-colors"
              >
                <span>View Full Workforce Profile & Certifications</span>
                <ExternalLink className="size-3.5 text-[#78716C]" />
              </Link>

              <Link
                href="/gm/settings"
                onClick={onClose}
                className="flex items-center justify-between rounded-xl border border-[#E7E5E0] bg-white p-3 text-xs font-bold text-[#1C1917] hover:bg-[#FAFAF8] transition-colors"
              >
                <span>Location Profile & Alert Thresholds</span>
                <ExternalLink className="size-3.5 text-[#78716C]" />
              </Link>
            </div>
          </div>

          {/* Footer with Logout */}
          <div className="border-t border-[#E7E5E0] bg-[#FAFAF8] p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B91C1C] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#991B1B] transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Log Out of Privé</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
