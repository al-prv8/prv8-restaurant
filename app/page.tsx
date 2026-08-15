"use client";

import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Activity, Building2, Store,
  UserRound, MessageSquareHeart, TrendingUp, Plug,
  AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import { usePrive } from "@/lib/prive/store";
import { moneyShort } from "@/lib/prive/forecast";

const ENTRIES = [
  {
    to: "/gm/home",
    label: "General Manager",
    who: "Jordan Ellis · Ballantyne #02",
    desc: "Command brief, readiness score, potato shortage order, staffing broadcast, and guest recovery approvals.",
    icon: Store,
    badge: "GM Persona",
    highlight: true,
  },
  {
    to: "/employee/home",
    label: "Employee Portal",
    who: "Maya Robinson · Server",
    desc: "Today's shift overview, tip velocity forecast, allergen safety quiz, and open shift pickup.",
    icon: UserRound,
    badge: "Front-of-House",
    highlight: false,
  },
  {
    to: "/regional/portfolio",
    label: "Regional Director",
    who: "Dana Whitmore · Carolinas",
    desc: "12-store location health matrix, root cause deterioration breakdown, and cross-store supply chain.",
    icon: Building2,
    badge: "Carolinas Region",
    highlight: false,
  },
  {
    to: "/executive/pulse",
    label: "C-Suite Executive",
    who: "Ellis Rourke · COO",
    desc: "Enterprise financial pulse, EBITDA margin variance, what-if scenario engine, and executive brief export.",
    icon: TrendingUp,
    badge: "Executive COO",
    highlight: false,
  },
  {
    to: "/guest/service",
    label: "Guest Service Portal",
    who: "Voice AI & Digital Contact",
    desc: "24/7 Voice AI call intake simulation, missing item logging, and tokenized single-use credit redemption.",
    icon: MessageSquareHeart,
    badge: "24/7 Service",
    highlight: false,
  },
  {
    to: "/integrations",
    label: "Integrations & Audit Log",
    who: "Immutable Ledger",
    desc: "Connected source systems (Toast, Paycor, 7shifts, R365) and audit trail for every human approval.",
    icon: Plug,
    badge: "Security & Governance",
    highlight: false,
  },
] as const;

export default function Home() {
  const { derived: d } = usePrive();
  const pendingCount = d.pendingApprovals.filter((p) => !p.done).length;
  const readinessColor =
    d.readiness.score >= 85 ? "#15803D" : d.readiness.score >= 70 ? "#B45309" : "#B91C1C";

  return (
    <main className="relative min-h-screen text-[#1C1917] bg-[#F4EFEA] overflow-x-hidden">
      {/* ── Ambient Background Orbs for Glassmorphic Refraction ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 size-[550px] rounded-full bg-[#881337]/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 size-[500px] rounded-full bg-[#B45309]/12 blur-[120px]" />
        <div className="absolute -bottom-24 left-1/3 size-[600px] rounded-full bg-[#15803D]/10 blur-[130px]" />
        <div className="absolute top-2/3 left-10 size-[400px] rounded-full bg-[#881337]/10 blur-[110px]" />
      </div>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 border-b border-white/20 bg-white/40 backdrop-blur-md sticky top-0">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="grid size-8 place-items-center rounded-md font-black text-white text-sm shadow-sm"
              style={{ backgroundColor: "#881337" }}
            >
              P
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-black tracking-widest text-[#1C1917]">PRIVÉ</span>
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wide hidden sm:block">Restaurant Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#15803D]/10 px-3 py-1 text-[11px] font-bold text-[#15803D]">
              <span className="size-1.5 rounded-full bg-[#15803D] animate-pulse" />
              12 Carolinas Locations · Live
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#78716C]">
              <Clock className="size-3.5" />
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:py-14 space-y-12">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#881337]">
            District & Regional Management · Demo Environment
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.1] tracking-tight sm:text-6xl text-[#1C1917]">
            Every location.{" "}
            <br className="hidden sm:block" />
            Every shift.{" "}
            <span className="text-[#881337]">One command view.</span>
          </h1>
          <p className="max-w-2xl text-[15px] text-[#78716C] font-medium leading-relaxed">
            Privé connects POS, payroll, scheduling, inventory, and guest systems into a single intelligence layer —
            forecasting demand, flagging risks, and routing decisions to the right person at the right time.
          </p>
        </div>

        {/* ── Live Metrics Strip ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Store Readiness</div>
            <div className="text-3xl font-black tabular-nums mt-1.5" style={{ color: readinessColor }}>
              {d.readiness.score}%
            </div>
            <div className="text-[11px] text-[#78716C] font-medium mt-0.5">Ballantyne #02</div>
          </div>
          <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Tomorrow Sales</div>
            <div className="text-3xl font-black tabular-nums mt-1.5 text-[#1C1917]">
              {moneyShort(d.tomorrow.sales)}
            </div>
            <div className="text-[11px] text-[#78716C] font-medium mt-0.5">
              +{d.tomorrow.vsTypicalPct}% vs typical
            </div>
          </div>
          <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">MTD Enterprise</div>
            <div className="text-3xl font-black tabular-nums mt-1.5 text-[#881337]">
              {moneyShort(d.enterprise.monthRevenue)}
            </div>
            <div className="text-[11px] text-[#78716C] font-medium mt-0.5">12 Carolinas Stores</div>
          </div>
          <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Pending Approvals</div>
            <div className={`text-3xl font-black tabular-nums mt-1.5 ${pendingCount > 0 ? "text-[#B45309]" : "text-[#15803D]"}`}>
              {pendingCount}
            </div>
            <div className="text-[11px] text-[#78716C] font-medium mt-0.5">
              {pendingCount > 0 ? "Awaiting GM Sign-Off" : "All Cleared"}
            </div>
          </div>
        </div>

        {/* ── Attention Banner (only if pending) ─────────────────────────── */}
        {pendingCount > 0 && (
          <div className="flex items-start gap-4 rounded-2xl bg-[#B45309]/10 border border-[#B45309]/20 p-4 shadow-sm">
            <AlertTriangle className="size-5 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold text-[#92400E]">
                {pendingCount} operational action{pendingCount > 1 ? "s" : ""} pending at Ballantyne #02
              </div>
              <p className="text-xs font-medium text-[#92400E]/80 mt-0.5">
                Enter the GM workspace below to review and approve. Each approval is logged to the immutable audit trail.
              </p>
            </div>
          </div>
        )}

        {/* ── Workspace Grid ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">
            Select workspace
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ENTRIES.map((entry) => {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.to}
                  href={entry.to}
                  className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] ring-1 ring-black/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(31,38,135,0.1)] hover:bg-white/75 flex flex-col justify-between before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/90 before:to-transparent"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="grid size-9 place-items-center rounded-lg bg-[#881337]/8 text-[#881337]">
                        <Icon className="size-4" />
                      </div>
                      <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#78716C]">
                        {entry.badge}
                      </span>
                    </div>

                    <h3 className="text-[15px] font-bold text-[#1C1917] group-hover:text-[#881337] transition-colors">
                      {entry.label}
                    </h3>
                    <div className="text-[12px] font-semibold text-[#881337] mt-0.5 opacity-90">{entry.who}</div>
                    <p className="mt-2.5 text-[12px] text-[#78716C] font-medium leading-relaxed">{entry.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E7E5E0] flex items-center gap-1.5 text-[12px] font-bold text-[#881337]">
                    Enter Workspace <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Governance Footer ───────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
            <ShieldCheck className="size-5 text-[#15803D] mx-auto mb-2" />
            <div className="text-[12px] font-bold text-[#1C1917]">Human-in-the-Loop</div>
            <p className="text-[11px] text-[#78716C] mt-1">No action executes without explicit GM sign-off</p>
          </div>
          <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
            <Activity className="size-5 text-[#881337] mx-auto mb-2" />
            <div className="text-[12px] font-bold text-[#1C1917]">Live Intelligence</div>
            <p className="text-[11px] text-[#78716C] mt-1">POS, payroll, scheduling & inventory — unified</p>
          </div>
          <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-black/[0.04] p-5">
            <CheckCircle2 className="size-5 text-[#B45309] mx-auto mb-2" />
            <div className="text-[12px] font-bold text-[#1C1917]">Immutable Audit Trail</div>
            <p className="text-[11px] text-[#78716C] mt-1">Every approval logged with timestamp & actor</p>
          </div>
        </div>

      </div>
    </main>
  );
}
