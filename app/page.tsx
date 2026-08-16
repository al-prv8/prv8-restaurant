"use client";

import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Activity, Building2, Store,
  UserRound, MessageSquareHeart, TrendingUp, Plug,
  AlertTriangle, CheckCircle2, Clock, ChevronRight
} from "lucide-react";
import { usePrive } from "@/lib/prive/store";
import { moneyShort } from "@/lib/prive/forecast";

const ROLES = [
  {
    to: "/gm/home",
    label: "General Manager",
    who: "Jordan Ellis · Ballantyne #02",
    desc: "Operations command, readiness score, staffing, inventory, guest recovery approvals.",
    icon: Store,
    badge: "GM",
  },
  {
    to: "/employee/home",
    label: "Employee Portal",
    who: "Maya Robinson · Server",
    desc: "Today's shift, training modules, open shift pickup, schedule, and announcements.",
    icon: UserRound,
    badge: "FOH",
  },
  {
    to: "/regional/portfolio",
    label: "Regional Director",
    who: "Dana Whitmore · Carolinas",
    desc: "12-location health matrix, root cause analysis, cross-store supply chain.",
    icon: Building2,
    badge: "Regional",
  },
  {
    to: "/executive/pulse",
    label: "C-Suite Executive",
    who: "Ellis Rourke · COO",
    desc: "Enterprise financial pulse, EBITDA variance, what-if scenario engine.",
    icon: TrendingUp,
    badge: "Executive",
  },
  {
    to: "/guest/service",
    label: "Guest Services",
    who: "Voice AI & Digital Contact",
    desc: "24/7 voice AI intake simulation, tokenized credit redemption.",
    icon: MessageSquareHeart,
    badge: "Guest",
  },
  {
    to: "/integrations",
    label: "Integrations & Audit Trail",
    who: "Toast · Paycor · 7shifts · R365",
    desc: "Connected source systems and audit trail for every human approval.",
    icon: Plug,
    badge: "Ops",
  },
] as const;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDate() {
  return new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

export default function Home() {
  const { derived: d } = usePrive();
  const pendingCount = d.pendingApprovals.filter((p) => !p.done).length;
  const readinessColor =
    d.readiness.score >= 85 ? "#15803D" : d.readiness.score >= 70 ? "#B45309" : "#B91C1C";

  return (
    <main className="relative min-h-screen text-[#1C1917] bg-[#F7F5F2] overflow-x-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="border-b border-[#E7E5E0] bg-[#1C1917] sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="grid size-7 place-items-center rounded-md font-black text-white text-sm"
              style={{ backgroundColor: "#881337" }}
            >
              P
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[14px] font-black tracking-widest text-white">PRIVÉ</span>
              <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide hidden sm:block">Restaurant Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
              <span className="size-1.5 rounded-full bg-[#15803D] animate-pulse" />
              12 Carolinas Locations · Live
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50">
              <Clock className="size-3.5" />
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14 space-y-10">

        {/* ── Welcome Header ────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#881337] mb-1">
            {getDate()} · Ballantyne #02 — Operations
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
            {getGreeting()}, Jordan Ellis.
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[#78716C]">
            Privé connects Toast, Paycor, 7shifts, Restaurant365, and Guest systems into one operating intelligence layer.
          </p>
        </div>

        {/* ── Location Hero Banner ──────────────────────────────────────── */}
        <div className="relative h-[200px] sm:h-[260px] w-full overflow-hidden rounded-xl border border-[#E7E5E0] shadow-sm">
          <img
            src="/dining-room.jpg"
            alt="The Morning Table dining room"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/85 via-[#1C1917]/50 to-[#1C1917]/10" />
          <div className="absolute inset-0 flex items-center px-6 sm:px-10">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2">
                The Morning Table · Carolinas Portfolio
              </div>
              <div className="text-2xl font-black text-white sm:text-3xl leading-tight">
                Ballantyne #02
              </div>
              <div className="text-sm font-medium text-white/70 mt-1">
                Charlotte, NC · 12,400 sq ft · 220 covers
              </div>
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#15803D] px-3 py-1 text-[11px] font-bold text-white">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  Dining Room Open
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-[11px] font-bold text-white">
                  Saturday Service
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Live Status Strip ────────────────────────────────────────── */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-xl border border-[#E7E5E0] bg-white shadow-sm divide-x divide-[#F3F2F0] overflow-hidden">
          <div className="px-5 py-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Store Readiness</div>
            <div className="text-2xl font-bold tabular-nums mt-1.5" style={{ color: readinessColor }}>
              {d.readiness.score}%
            </div>
            <div className="text-[11px] text-[#78716C] font-medium mt-0.5">Ballantyne #02</div>
          </div>
          <div className="px-5 py-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Tomorrow Sales</div>
            <div className="text-2xl font-bold tabular-nums mt-1.5 text-[#1C1917]">
              {moneyShort(d.tomorrow.sales)}
            </div>
            <div className="text-[11px] text-[#78716C] font-medium mt-0.5">
              +{d.tomorrow.vsTypicalPct}% vs typical
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">MTD Enterprise</div>
            <div className="text-2xl font-bold tabular-nums mt-1.5 text-[#881337]">
              {moneyShort(d.enterprise.monthRevenue)}
            </div>
            <div className="text-[11px] text-[#78716C] font-medium mt-0.5">12 Carolinas Stores</div>
          </div>
          <div className="px-5 py-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#A8A29E]">Pending Approvals</div>
            <div className={`text-2xl font-bold tabular-nums mt-1.5 ${pendingCount > 0 ? "text-[#B45309]" : "text-[#15803D]"}`}>
              {pendingCount}
            </div>
            <div className="text-[11px] text-[#78716C] font-medium mt-0.5">
              {pendingCount > 0 ? "Awaiting GM Sign-Off" : "All Cleared"}
            </div>
          </div>
        </div>

        {/* ── Attention Banner ─────────────────────────────────────────── */}
        {pendingCount > 0 && (
          <div className="flex items-start gap-4 rounded-xl bg-[#FFFBEB] border border-[#B45309]/30 border-l-4 border-l-[#B45309] p-4">
            <AlertTriangle className="size-4 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold text-[#92400E]">
                {pendingCount} operational action{pendingCount > 1 ? "s" : ""} pending at Ballantyne #02
              </div>
              <p className="text-xs font-medium text-[#92400E]/80 mt-0.5">
                Enter the GM module to review and approve. Every approval is logged to the audit trail.
              </p>
            </div>
            <Link href="/gm/home" className="ml-auto shrink-0 rounded-md bg-[#881337] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#6B0F2A] transition-colors">
              Go to GM →
            </Link>
          </div>
        )}

        {/* ── Role Selector ────────────────────────────────────────────── */}
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-4">
            View As
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((entry) => {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.to}
                  href={entry.to}
                  className="group flex items-start gap-4 rounded-xl border border-[#E7E5E0] bg-white p-4 shadow-sm transition-all hover:border-[#881337]/30 hover:shadow-md"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#F7F5F2] text-[#881337] group-hover:bg-[#881337]/8 transition-colors">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13px] font-bold text-[#1C1917] group-hover:text-[#881337] transition-colors leading-snug">
                        {entry.label}
                      </h3>
                      <span className="rounded-md bg-[#F7F5F2] border border-[#E7E5E0] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#78716C] shrink-0">
                        {entry.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#881337] mt-0.5 opacity-80">{entry.who}</div>
                    <p className="mt-1.5 text-[11px] text-[#78716C] font-medium leading-relaxed">{entry.desc}</p>
                  </div>
                  <ChevronRight className="size-4 text-[#E7E5E0] group-hover:text-[#881337] shrink-0 mt-0.5 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Governance Footer ────────────────────────────────────────── */}
        <div className="border-t border-[#F3F2F0] pt-8 grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="size-4 text-[#15803D] shrink-0 mt-0.5" />
            <div>
              <div className="text-[12px] font-bold text-[#1C1917]">Human-in-the-Loop</div>
              <p className="text-[11px] text-[#78716C] mt-0.5">No action executes without explicit GM sign-off</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Activity className="size-4 text-[#881337] shrink-0 mt-0.5" />
            <div>
              <div className="text-[12px] font-bold text-[#1C1917]">Operational Intelligence</div>
              <p className="text-[11px] text-[#78716C] mt-0.5">POS, payroll, scheduling & inventory — unified</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-4 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <div className="text-[12px] font-bold text-[#1C1917]">Audit Trail</div>
              <p className="text-[11px] text-[#78716C] mt-0.5">Every approval logged with timestamp & actor</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
