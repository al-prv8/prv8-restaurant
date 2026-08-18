"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Store,
  Clock,
  Bell,
  Sliders,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Card, SectionTitle, KpiRow, Button, Pill, PriveIntelBanner } from "@/components/prive/ui";

export default function GmSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#881337] mb-1">
            BALLANTYNE #02 · SYSTEM CONFIGURATION
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917]">
            Location Settings & Alert Controls
          </h1>
          <p className="mt-1 max-w-3xl text-sm font-medium text-[#78716C]">
            Configure store operating hours, POS integration sync rates, labor budget targets, and Privé notification thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handleSave} className="flex items-center gap-1.5">
            <Save className="size-3.5" />
            <span>{saved ? "Settings Saved!" : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <KpiRow
        items={[
          { label: "Location", value: "Ballantyne #02", tone: "good", sub: "Charlotte, NC" },
          { label: "POS Status", value: "Toast POS Syncing", tone: "good", sub: "Live (5 sec latency)" },
          { label: "Labor Target", value: "23.0%", tone: "good", sub: "Configured by Regional" },
          { label: "AI Auto-Approve", value: "HITL Mode", tone: "good", sub: "Manager Review Required" },
        ]}
      />

      <PriveIntelBanner
        summary="Ballantyne #02 is running in Human-in-the-Loop mode. All AI-generated actions require GM approval before execution."
        details={[
          "Toast POS is live-syncing at a 5-second latency. Labor target is set at 23.0% by Regional Director.",
          "HITL governance mode is active. Privé cannot auto-approve orders, credits, or schedule changes.",
          "Configuration changes are logged to the immutable audit trail with your name and timestamp.",
        ]}
      />

      {/* Settings Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <SectionTitle hint="Store Profile">Operating Hours & Location</SectionTitle>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">Store Name</label>
              <input type="text" defaultValue="Ballantyne #02" className="w-full rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] p-2.5 font-bold text-[#1C1917]" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">Operating Hours</label>
              <input type="text" defaultValue="Mon-Sun: 10:00 AM – 10:00 PM" className="w-full rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] p-2.5 font-bold text-[#1C1917]" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">Primary Manager</label>
              <input type="text" defaultValue="Jordan Ellis (General Manager)" className="w-full rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] p-2.5 font-bold text-[#1C1917]" />
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle hint="Privé AI Intelligence">Thresholds & Notification Controls</SectionTitle>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">Target Labor % Budget</label>
              <input type="text" defaultValue="23.0%" className="w-full rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] p-2.5 font-bold text-[#1C1917]" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">Guest Complaint Auto-Drafting</label>
              <input type="text" defaultValue="Enabled (Requires GM Approval)" className="w-full rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] p-2.5 font-bold text-[#1C1917]" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#78716C] mb-1">Inventory Shortage Alert Lead Time</label>
              <input type="text" defaultValue="24 hours before stockout" className="w-full rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] p-2.5 font-bold text-[#1C1917]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
