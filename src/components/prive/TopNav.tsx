"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  MessageSquare,
  Bell,
  Brain,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Gift,
  GraduationCap,
  Home,
  LayoutGrid,
  MapPin,
  Menu,
  MessageSquareHeart,
  Package,
  Phone,
  Plug,
  Search,
  SlidersHorizontal,
  Store,
  TrendingUp,
  Truck,
  UserCheck,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { TODAY, fmtDate } from "@/lib/prive/data";
import { usePrive, type Persona } from "@/lib/prive/store";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const BRAND_BG = "#1C1917";
const BRAND_ACCENT = "#881337";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface NavSubItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: React.ReactNode;
}

export interface NavPersona {
  id: string;
  label: string;
  who: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  items?: NavSubItem[];
}

// ─── Dropdown Menu ────────────────────────────────────────────────────────────
function DropdownMenu({
  persona,
  isOpen,
  onClose,
}: {
  persona: NavPersona;
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  if (!isOpen || !persona.items) return null;

  return (
    <div className="absolute top-full left-0 z-50 mt-0 w-60 overflow-hidden rounded-b-xl bg-[#1C1917]/95 backdrop-blur-md shadow-xl border border-white/10 animate-in fade-in slide-in-from-top-1 duration-150">
      {/* Dropdown header */}
      <div className="border-b border-white/10 bg-white/8 px-4 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
          {persona.who}
        </p>
      </div>
      {/* Items */}
      <div className="py-1.5">
        {persona.items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#881337]/8 text-[#881337] font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                className={`size-3.5 shrink-0 ${isActive ? "text-[#881337]" : "text-white/40"}`}
                aria-hidden
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span className="size-1.5 rounded-full bg-[#881337] shrink-0" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Persona Tab (desktop) ────────────────────────────────────────────────────
function PersonaTab({ persona }: { persona: NavPersona }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = persona.icon;
  const hasItems = !!(persona.items && persona.items.length > 0);

  const isActivePath =
    pathname === persona.href || pathname.startsWith(`/${persona.id}/`) || pathname === `/${persona.id}`;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on route change (dropdown closes when a link inside it is clicked)
  useEffect(() => {
    setOpen(false);
  }, [pathname]); // pathname from usePathname — stable ref, only changes on navigation

  const tabClass = `flex items-center gap-2 px-4 py-5 text-[13px] font-semibold border-b-2 transition-all whitespace-nowrap ${
    isActivePath
      ? "border-[#881337] text-white"
      : "border-transparent text-white/60 hover:text-white/90 hover:border-white/20"
  }`;

  if (!hasItems) {
    return (
      <div ref={ref} className="relative">
        <Link href={persona.href} className={tabClass}>
          <Icon className="size-3.5 shrink-0" aria-hidden />
          <span>{persona.label}</span>
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={tabClass}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden />
        <span>{persona.label}</span>
        {persona.badge ? (
          <span className="flex size-4 items-center justify-center rounded-full bg-[#881337] text-[9px] font-extrabold text-white tabular-nums">
            {persona.badge}
          </span>
        ) : null}
        <ChevronDown
          className={`size-3 opacity-60 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <DropdownMenu persona={persona} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({
  personas,
  open,
  onClose,
  onResetDemo,
}: {
  personas: NavPersona[];
  open: boolean;
  onClose: () => void;
  onResetDemo: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const prevPathRef = useRef(pathname);

  // Auto-expand current persona when drawer opens
  useEffect(() => {
    if (!open) return;
    const current = personas.find(
      (p) => pathname === p.href || pathname.startsWith(`/${p.id}/`) || pathname === `/${p.id}`
    );
    setExpanded(current?.id ?? null);
  }, [open]); // intentionally only runs when `open` changes, not on every pathname change

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close drawer on route change (but NOT on first mount)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (open) onClose();
    }
  }, [pathname, open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ backgroundColor: BRAND_BG }}
        >
          <div>
            <div className="text-[15px] font-extrabold tracking-widest text-white">PRIVÉ</div>
            <div className="text-[11px] text-white/40 font-medium">Restaurant Intelligence</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto">
          {personas.map((p) => {
            const Icon = p.icon;
            const isActive = pathname === p.href || pathname.startsWith(`/${p.id}/`) || pathname === `/${p.id}`;
            const isExpanded = expanded === p.id;

            return (
              <div key={p.id} className="border-b border-[#F5F4F0]">
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : p.id)}
                  className={`flex w-full items-center gap-3 px-5 py-3.5 text-[13px] font-semibold transition-colors hover:bg-white/10 ${
                    isActive ? "text-[#881337]" : "text-white"
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 ${isActive ? "text-[#881337]" : "text-white/40"}`}
                  />
                  <span className="flex-1 text-left">{p.label}</span>
                  {p.badge ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#881337] text-[9px] font-extrabold text-white">
                      {p.badge}
                    </span>
                  ) : null}
                  {p.items && (
                    <ChevronDown
                      className={`size-3.5 text-white/40 transition-transform duration-150 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {isExpanded && p.items && (
                  <div className="border-l-2 border-[#881337]/25 ml-5 mb-1">
                    {p.items.map((sub) => {
                      const SubIcon = sub.icon;
                      const subActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`flex items-center gap-3 px-5 py-2.5 text-[12px] font-medium transition-colors ${
                            subActive
                              ? "text-[#881337] font-semibold bg-[#881337]/5"
                              : "text-white/55 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <SubIcon className="size-3.5 shrink-0" aria-hidden />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-white/8 p-4 space-y-3">
          <button
            type="button"
            onClick={() => { onResetDemo(); onClose(); }}
            className="w-full rounded-lg border border-[#E7E5E0] bg-white px-4 py-2.5 text-[12px] font-semibold text-white/55 hover:text-white text-left transition-colors"
          >
            Reset Demo State
          </button>
          <div className="flex items-center gap-2 px-1 text-[11px] text-white/40 font-medium">
            <span className="size-1.5 rounded-full bg-[#15803D] inline-block animate-pulse" />
            Privé Live Signal · Online
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Top Navbar (main export) ─────────────────────────────────────────────────
export function TopNav({
  persona,
  onOpenSearch,
  onOpenAskPrive,
  onResetDemo,
}: {
  persona: Persona;
  onOpenSearch: () => void;
  onOpenAskPrive: () => void;
  onResetDemo: () => void;
}) {
  const { derived: d } = usePrive();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClose = useCallback(() => setMobileOpen(false), []);

  // Build persona list — memoised so badge count updates don't rebuild on every render
  const personas: NavPersona[] = useMemo(
    () => [
      {
        id: "gm",
        label: "General Manager",
        who: "Jordan Ellis · Ballantyne #02",
        href: "/gm/home",
        icon: Store,
        badge: d.alerts.length > 0 ? d.alerts.length : undefined,
        items: [
          { label: "Command Brief", href: "/gm/home", icon: Home },
          { label: "Staffing & Labor", href: "/gm/staffing", icon: Users },
          { label: "Inventory Risk", href: "/gm/inventory", icon: Package },
          { label: "Guest Complaints", href: "/gm/guests", icon: MessageSquareHeart },
          { label: "Workforce", href: "/gm/workforce", icon: UserCheck },
          { label: "Facility Score", href: "/gm/facility", icon: Wrench },
          { label: "Communications", href: "/gm/communications", icon: Bell },
          { label: "Approvals Queue", href: "/gm/approvals", icon: ClipboardList },
        ],
      },
      {
        id: "employee",
        label: "Employee",
        who: "Maya Robinson · Server",
        href: "/employee/home",
        icon: UserRound,
        items: [
          { label: "Today's Shift", href: "/employee/home", icon: Home },
          { label: "Training", href: "/employee/training", icon: GraduationCap },
          { label: "Schedule Pickup", href: "/employee/schedule", icon: CalendarDays },
          { label: "Policy & Comms", href: "/employee/announcements", icon: Bell },
        ],
      },
      {
        id: "regional",
        label: "Regional",
        who: "Dana Whitmore · Carolinas",
        href: "/regional/portfolio",
        icon: Building2,
        items: [
          { label: "Portfolio Health", href: "/regional/portfolio", icon: MapPin },
          { label: "Intelligence", href: "/regional/intelligence", icon: Brain },
          { label: "Supply Chain", href: "/regional/supply-chain", icon: Truck },
        ],
      },
      {
        id: "executive",
        label: "Executive",
        who: "Ellis Rourke · COO",
        href: "/executive/pulse",
        icon: TrendingUp,
        items: [
          { label: "Enterprise Pulse", href: "/executive/pulse", icon: TrendingUp },
          { label: "Scenario Engine", href: "/executive/scenario", icon: SlidersHorizontal },
          { label: "Portfolio Table", href: "/executive/portfolio", icon: LayoutGrid },
        ],
      },
      {
        id: "guest",
        label: "Guest Service",
        who: "Voice & Digital Contact",
        href: "/guest/service",
        icon: MessageSquareHeart,
        badge: d.openComplaints > 0 ? d.openComplaints : undefined,
        items: [
          { label: "Voice AI Intake", href: "/guest/service", icon: Phone },
          { label: "Recovery Credits", href: "/guest/credits", icon: Gift },
        ],
      },
      {
        id: "integrations",
        label: "Integrations",
        who: "Data Feeds & Event Audit",
        href: "/integrations",
        icon: Plug,
      },
    ],
    [d.alerts.length, d.openComplaints]
  );

  const activePersona = personas.find((p) => p.id === persona);

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.08]"
        style={{ backgroundColor: BRAND_BG }}
      >
        <div className="flex h-16 items-center gap-0 px-4 sm:px-6">
          {/* Brand logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 border-r border-white/[0.12] pr-5 mr-4"
          >
            <div
              className="grid size-8 shrink-0 place-items-center rounded-lg text-sm font-black text-white"
              style={{ backgroundColor: BRAND_ACCENT }}
            >
              P
            </div>
            <div className="hidden sm:block">
              <div className="text-[13px] font-extrabold tracking-[0.18em] text-white leading-tight">
                PRIVÉ
              </div>
              <div className="text-[9px] font-semibold tracking-[0.12em] text-white/35 leading-tight uppercase">
                Restaurant Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop persona tabs — flex-1 with overflow-hidden prevents pushing right controls off */}
          {/* overflow-x: clip constrains tabs horizontally WITHOUT clipping absolutely-positioned dropdowns */}
          <div className="hidden lg:flex items-stretch gap-0 flex-1 h-16 min-w-0" style={{ overflowX: "clip" }}>
            {personas.map((p) => (
              <PersonaTab key={p.id} persona={p} />
            ))}
          </div>

          {/* Right controls — always visible, shrink-0 */}
          <div className="ml-auto flex shrink-0 items-center gap-2 pl-3">
            {/* Current user context — desktop */}
            <div className="hidden xl:block text-right mr-3 border-r border-white/[0.08] pr-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 leading-tight">
                {fmtDate(TODAY)}
              </div>
              <div className="text-[11px] font-semibold text-white/60 leading-tight mt-0.5">
                {activePersona?.who ?? "Privé"}
              </div>
            </div>

            {/* Live signal */}
            <Link
              href="/integrations"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#15803D]/40 bg-[#15803D]/10 px-2.5 py-1 text-[11px] font-bold text-[#4ADE80] transition-opacity hover:opacity-80"
            >
              <Activity className="size-3" />
              Live
            </Link>

            {/* Search button */}
            <button
              type="button"
              onClick={onOpenSearch}
              title="Search (⌘K)"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-[12px] font-medium text-white/50 hover:border-white/20 hover:text-white/90 transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <Search className="size-3.5 shrink-0" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline rounded border border-white/10 px-1.5 py-0.5 text-[9px] font-bold text-white/40" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                ⌘K
              </kbd>
            </button>

            {/* Ask Privé — nav-integrated intelligence trigger */}
            {persona !== "guest" && (
              <button
                type="button"
                onClick={onOpenAskPrive}
                title="Ask Privé"
                className="flex items-center gap-1.5 rounded-lg border border-[#881337]/50 bg-[#881337]/15 px-3 py-1.5 text-[12px] font-bold text-[#FF8FA3] hover:bg-[#881337]/25 hover:border-[#881337]/70 transition-all"
              >
                <MessageSquare className="size-3.5 shrink-0" />
                <span className="hidden sm:inline">Ask Privé</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center size-9 rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — rendered outside nav to avoid stacking context issues */}
      <MobileDrawer
        personas={personas}
        open={mobileOpen}
        onClose={handleClose}
        onResetDemo={onResetDemo}
      />
    </>
  );
}
