import { Link, createFileRoute } from "@tanstack/react-router";
import { Sparkles, ArrowRight, ShieldCheck, Activity, Building2, Store, UserRound, MessageSquareHeart, TrendingUp, Plug } from "lucide-react";
import { usePrive } from "@/lib/prive/store";
import { moneyShort } from "@/lib/prive/forecast";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Privé — Restaurant Intelligence Platform" },
      { name: "description", content: "A cognitive layer over POS, payroll, inventory and guest systems for The Morning Table Restaurant Group." },
      { property: "og:title", content: "Privé — Restaurant Intelligence Platform" },
      { property: "og:description", content: "Forecasting, workforce and guest intelligence across 12 Carolinas restaurants." },
    ],
  }),
  component: Home,
});

const ENTRIES = [
  {
    to: "/gm/home",
    label: "General Manager",
    who: "Jordan Ellis · Ballantyne #02",
    desc: "Command brief, readiness score, potato shortage order, staffing broadcast, and guest recovery approvals.",
    icon: Store,
    badge: "GM Persona",
    tagColor: "bg-[#5146E5]/10 text-[#5146E5] border-[#5146E5]/20",
  },
  {
    to: "/employee/home",
    label: "Employee Portal",
    who: "Maya Robinson · Server",
    desc: "Today's shift overview, tip velocity forecast, allergen safety quiz, and open shift pickup.",
    icon: UserRound,
    badge: "Front-of-House",
    tagColor: "bg-[#0F9D8A]/10 text-[#0B7A6C] border-[#0F9D8A]/20",
  },
  {
    to: "/regional/portfolio",
    label: "Regional Director",
    who: "Dana Whitmore · Carolinas",
    desc: "12-store location health matrix, root cause deterioration breakdown, and cross-store supply chain.",
    icon: Building2,
    badge: "Carolinas Region",
    tagColor: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20",
  },
  {
    to: "/executive/pulse",
    label: "C-Suite Executive",
    who: "Ellis Rourke · COO",
    desc: "Enterprise financial pulse, EBITDA margin variance, what-if scenario engine, and executive brief export.",
    icon: TrendingUp,
    badge: "Executive COO",
    tagColor: "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20",
  },
  {
    to: "/guest/service",
    label: "Guest Service Portal",
    who: "Voice AI & Digital Contact",
    desc: "24/7 Voice AI call intake simulation, missing item logging, and tokenized single-use credit redemption.",
    icon: MessageSquareHeart,
    badge: "24/7 AI Service",
    tagColor: "bg-[#F59E0B]/10 text-[#92400E] border-[#F59E0B]/20",
  },
  {
    to: "/integrations",
    label: "Integrations & Audit Log",
    who: "Immutable Ledger",
    desc: "Connected source systems (Toast, Paycor, 7shifts, R365) and audit trail for every human approval.",
    icon: Plug,
    badge: "Security & Governance",
    tagColor: "bg-[#475569]/10 text-[#334155] border-[#475569]/20",
  },
] as const;

function Home() {
  const { derived: d } = usePrive();

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#101828] selection:bg-[#5146E5] selection:text-white">
      <div className="relative mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* Header brand badge */}
        <div className="flex items-center justify-between border-b border-[#101828]/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#5146E5] font-extrabold text-white text-lg shadow-md shadow-[#5146E5]/30">
              P
            </span>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#101828]">PRIVÉ</span>
              <span className="ml-2 text-xs font-bold text-[#101828]/50">v2.0 Restaurant Intelligence</span>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#0F9D8A]/30 bg-[#0F9D8A]/10 px-3.5 py-1 text-xs font-bold text-[#0B7A6C]">
            <Activity className="size-3.5" /> 12 Carolinas Locations Online
          </span>
        </div>

        {/* Hero Title */}
        <div className="mt-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-3.5 py-1.5 text-xs font-bold text-[#7C3AED] mb-3">
            <Sparkles className="size-3.5" /> Cognitive AI Operating System
          </div>
          <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl text-[#101828]">
            The Intelligence Layer for{" "}
            <span className="text-[#5146E5]">
              The Morning Table
            </span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-[#101828]/70 font-medium leading-relaxed">
            One cognitive AI engine connected across POS, payroll, scheduling, inventory, and guest systems — answering questions, forecasting demand, and executing actions with strict human-in-the-loop governance.
          </p>
        </div>

        {/* Live Metrics Quick Strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border border-[#101828]/10 bg-white p-4 shadow-xs">
          <div className="border-r border-[#101828]/10 pr-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/45">Store Readiness</div>
            <div className="text-2xl font-extrabold text-[#0B7A6C] tabular-nums mt-0.5">{d.readiness.score}%</div>
            <div className="text-[11px] text-[#101828]/55 font-semibold">Optimal Operating State</div>
          </div>
          <div className="border-r border-[#101828]/10 pr-3 pl-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/45">Tomorrow Sales</div>
            <div className="text-2xl font-extrabold text-[#101828] tabular-nums mt-0.5">{moneyShort(d.tomorrow.sales)}</div>
            <div className="text-[11px] text-[#101828]/55 font-semibold">+{d.tomorrow.vsTypicalPct}% vs typical</div>
          </div>
          <div className="border-r border-[#101828]/10 pr-3 pl-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/45">MTD Enterprise Revenue</div>
            <div className="text-2xl font-extrabold text-[#5146E5] tabular-nums mt-0.5">{moneyShort(d.enterprise.monthRevenue)}</div>
            <div className="text-[11px] text-[#101828]/55 font-semibold">12 Carolinas Stores</div>
          </div>
          <div className="pl-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#101828]/45">Pending Approvals</div>
            <div className="text-2xl font-extrabold text-[#92400E] tabular-nums mt-0.5">{d.pendingApprovals.filter(p => !p.done).length}</div>
            <div className="text-[11px] text-[#101828]/55 font-semibold">Human-in-the-Loop</div>
          </div>
        </div>

        {/* Persona Selectors Grid */}
        <div className="mt-8">
          <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
            Select Role Persona to Enter Workspace:
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ENTRIES.map((e) => {
              const Icon = e.icon;
              return (
                <Link
                  key={e.to}
                  to={e.to}
                  className="group relative overflow-hidden rounded-2xl border border-[#101828]/10 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#5146E5] hover:shadow-md shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="grid size-10 place-items-center rounded-xl bg-[#5146E5]/10 text-[#5146E5]">
                        <Icon className="size-5" />
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${e.tagColor}`}>
                        {e.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#101828] group-hover:text-[#5146E5] transition-colors">
                      {e.label}
                    </h3>
                    <div className="text-xs font-semibold text-[#5146E5] mt-0.5">{e.who}</div>
                    <p className="mt-2 text-xs text-[#101828]/65 font-medium leading-relaxed">{e.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#101828]/8 flex items-center gap-1.5 text-xs font-bold text-[#5146E5]">
                    Enter Workspace <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Governance Footer */}
        <div className="mt-12 rounded-2xl border border-[#101828]/10 bg-white p-5 text-center text-xs text-[#101828]/60 shadow-xs space-y-1.5">
          <div className="flex items-center justify-center gap-2 font-bold text-[#101828]">
            <ShieldCheck className="size-4 text-[#0F9D8A]" /> Privé Human Governance Engine
          </div>
          <p className="max-w-2xl mx-auto font-medium text-[#101828]/70">
            Privé operates under strict human-in-the-loop controls. No financial credits are issued, orders submitted, or schedules modified without explicit General Manager sign-off.
          </p>
        </div>
      </div>
    </main>
  );
}
