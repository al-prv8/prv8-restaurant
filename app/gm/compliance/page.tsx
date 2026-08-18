"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill, PriveIntelBanner } from "@/components/prive/ui";
import { usePrive } from "@/lib/prive/store";

export default function GmCompliancePage() {
  const { state, dispatch } = usePrive();

  const complianceItems = [
    { name: "ServSafe Food Manager", holder: "Jordan Ellis (GM)", expires: "Nov 2027", status: "Active", tone: "good" },
    { name: "ServSafe Food Handler", holder: "Andre Vega (Line Cook)", expires: state.certificationCompleted ? "Aug 2028" : "Expiring in 14 days", status: state.certificationCompleted ? "Renewed" : "Renewal Required", tone: state.certificationCompleted ? "good" : "bad" },
    { name: "Allergen Awareness Cert", holder: "Maya Robinson (Server)", expires: state.mayaTrainingComplete ? "Completed Today" : "Overdue (5 min training)", status: state.mayaTrainingComplete ? "Compliant" : "Action Needed", tone: state.mayaTrainingComplete ? "good" : "warn" },
    { name: "Health Dept Operating Permit", holder: "Ballantyne #02", expires: "Dec 2026", status: "Active", tone: "good" },
    { name: "Fire Suppression Inspection", holder: "Ansul System", expires: "Oct 2026", status: "Passed (98/100)", tone: "good" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · COMPLIANCE & SAFETY
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
            Compliance & Certification Center
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Health department permits, ServSafe certifications, food safety logs, and audit readiness scores.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => dispatch({ type: "completeCertification" })}
            disabled={state.certificationCompleted}
          >
            <RefreshCw className="size-3.5 mr-1.5 inline" />
            <span>{state.certificationCompleted ? "ServSafe Renewed" : "Renew Andre Vega Cert"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Compliance Score", value: "96 / 100", tone: "good", sub: "Grade A Health Rating" },
          { label: "Active Permits", value: "5 / 5", tone: "good", sub: "100% Verified" },
          { label: "Certifications Due", value: state.certificationCompleted ? "0" : "1", tone: state.certificationCompleted ? "good" : "warn", sub: "ServSafe Renewal" },
          { label: "Food Temp Audits", value: "Passed", tone: "good", sub: "Last logged 2 hrs ago" },
        ]}
      />

      <PriveIntelBanner
        summary={state.certificationCompleted
          ? "All certifications are current. Compliance score: 96/100. Next health department inspection probability: low risk."
          : "Andre Vega's ServSafe certification expires in 14 days. Renewing today prevents a compliance flag on your next inspection."
        }
        details={[
          "ServSafe Food Manager (Jordan Ellis) valid through Nov 2027.",
          "Health Department Operating Permit active through Dec 2026.",
          "Allergen Awareness module overdue for Maya Robinson, 5-minute completion required.",
        ]}
        action={!state.certificationCompleted ? () => dispatch({ type: "completeCertification" }) : undefined}
        actionLabel={!state.certificationCompleted ? "Renew Andre Vega Cert" : undefined}
      />

      {/* Priority Action Banner */}
      {!state.certificationCompleted && (
        <Card tone="alert">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#B91C1C]/10 text-[#B91C1C] mt-0.5">
                <AlertCircle className="size-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#B91C1C]">
                  ACTION REQUIRED · SERVSAFE RENEWAL
                </div>
                <div className="text-sm font-bold text-[#1C1917]">
                  Andre Vega&apos;s ServSafe Food Handler certification expires in 14 days.
                </div>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Complete the 10-minute online renewal module to maintain 100% store compliance.
                </p>
              </div>
            </div>

            <Button
              onClick={() => dispatch({ type: "completeCertification" })}
              className="shrink-0"
            >
              Complete ServSafe Renewal
            </Button>
          </div>
        </Card>
      )}

      {/* Certification Roster */}
      <Card>
        <SectionTitle hint="State & County Health Standards">
          Active Store Certifications & Permits
        </SectionTitle>

        <div className="overflow-x-auto rounded-xl border border-[#E7E5E0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F2] border-b border-[#E7E5E0] text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
              <tr>
                <th className="p-3">CERTIFICATION / PERMIT</th>
                <th className="p-3">HOLDER / SCOPE</th>
                <th className="p-3">EXPIRATION / STATUS</th>
                <th className="p-3 text-right">COMPLIANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F2F0] font-medium text-[#1C1917]">
              {complianceItems.map((c) => (
                <tr key={c.name} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="p-3 font-bold text-[#1C1917]">{c.name}</td>
                  <td className="p-3 text-[#78716C]">{c.holder}</td>
                  <td className="p-3">{c.expires}</td>
                  <td className="p-3 text-right">
                    <Pill tone={c.tone === "good" ? "teal" : c.tone === "warn" ? "amber" : "red"}>
                      {c.status}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
