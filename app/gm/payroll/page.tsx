"use client";

import React from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  DollarSign,
  Clock,
  ShieldCheck,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmPayrollPage() {
  const { state, derived: d, dispatch } = usePrive();
  const approved = state.extraStaffApproved >= 2;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · PAYROLL & COMPENSATION
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
            Payroll Queue & Wage Audits
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Bi-weekly payroll sign-off, tip distribution verification, overtime calculations, and Paycor export.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => dispatch({ type: "approveStaffing" })}
            disabled={approved}
          >
            <CheckCircle2 className="size-3.5 mr-1.5 inline" />
            <span>{approved ? "Payroll Approved" : "Approve Bi-Weekly Payroll ($14,280)"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Payroll Total", value: "$14,280", tone: "good", sub: "35 active employees" },
          { label: "Status", value: approved ? "Approved & Synced" : "Pending GM Sign-Off", tone: approved ? "good" : "warn", sub: "Cutoff Today 5 PM" },
          { label: "Tip Pool Distribution", value: "$3,840", tone: "good", sub: "100% verified" },
          { label: "Overtime Variance", value: "$0.00", tone: "good", sub: "0 overtime hours" },
        ]}
      />

      {/* Payroll Approval Card */}
      <Card tone={approved ? "intel" : "alert"}>
        <SectionTitle hint="Paycor POS Sync">
          Bi-Weekly Payroll Summary (Aug 1, Aug 15)
        </SectionTitle>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FAFAF8] p-4 rounded-xl border border-[#E7E5E0]">
            <div>
              <div className="text-sm font-bold text-[#1C1917]">
                Total Gross Wages: <span className="text-[#881337] font-black text-base">$14,280.00</span>
              </div>
              <div className="text-xs text-[#78716C] mt-0.5">
                Regular Hours: 840.0 hrs · Overtime: 0.0 hrs · Tip Adjustments: $3,840.00
              </div>
            </div>

            <Button
              onClick={() => dispatch({ type: "approveStaffing" })}
              disabled={approved}
            >
              {approved ? "Approved by Jordan Ellis" : "Sign Off & Submit to Paycor"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
