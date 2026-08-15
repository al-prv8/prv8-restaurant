import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, Suspense, type ReactNode } from "react";
import {
  Activity,
  Bell,
  Brain,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Gift,
  GraduationCap,
  Home,
  LayoutGrid,
  MapPin,
  MessageSquareHeart,
  Package,
  PanelLeft,
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
} from "lucide-react";
import { BRAND, TODAY, fmtDate } from "@/lib/prive/data";
import { usePrive, type Persona } from "@/lib/prive/store";
import { AskPriveDrawer } from "./AskPrive";
import { CommandPalette } from "./CommandPalette";

interface NavItemType {
  id?: string;
  label: string;
  who?: string;
  href: string;
  icon: typeof UserRound;
  badge?: number | string | ReactNode;
  items?: NavItemType[];
}

import { SidebarNavigationSimple } from "./SidebarSimple";
import { FeaturedCardProgressBar } from "./FeaturedCardProgressBar";
import { BadgeWithDot, PageSkeleton } from "./ui";

export function PriveShell({
  persona,
  children,
}: {
  persona: Persona;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  const { derived: d, dispatch } = usePrive();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItemsSimple: NavItemType[] = [
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
      label: "Employee Portal",
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
      label: "Regional Director",
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
      label: "C-Suite Executive",
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
      label: "Integrations & Audit",
      who: "Data Feeds & Event Audit",
      href: "/integrations",
      icon: Plug,
    },
  ];

  const ROLE_PILLS = [
    { id: "gm", label: "GM", href: "/gm/home" },
    { id: "employee", label: "Employee", href: "/employee/home" },
    { id: "regional", label: "Regional", href: "/regional/portfolio" },
    { id: "executive", label: "Executive", href: "/executive/pulse" },
    { id: "guest", label: "Guest", href: "/guest/service" },
  ];

  const activeWorkspace = navItemsSimple.find((p) => p.id === persona);
  const allSubItems = navItemsSimple.flatMap((n) => n.items ?? []);
  const currentModule = allSubItems.find((m) => m.href === pathname);

  const sidebarElement = (
    <SidebarNavigationSimple
      items={navItemsSimple}
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed((c) => !c)}
      onResetDemo={() => dispatch({ type: "resetDemo" })}
      footerItems={[
        {
          label: "Privé Live Signal",
          href: "/integrations",
          icon: Activity,
          badge: (
            <BadgeWithDot color="success">
              Online
            </BadgeWithDot>
          ),
        },
      ]}
      featureCard={
        <FeaturedCardProgressBar
          title="Store Readiness"
          description={
            d.readiness.score >= 85
              ? "All operational risks resolved."
              : `${d.pendingApprovals.filter((p) => !p.done).length} action(s) pending approval.`
          }
          confirmLabel="View Readiness"
          progress={d.readiness.score}
          className="hidden md:block"
          onConfirm={() => {}}
        />
      }
    />
  );

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#101828]">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden shrink-0 border-r border-[#101828]/10 transition-[width] duration-200 lg:block ${
          collapsed ? "w-[64px]" : "w-[260px]"
        }`}
      >
        {sidebarElement}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[260px]">{sidebarElement}</div>
        </div>
      ) : null}

      {/* Main content */}
      <div
        className={`transition-[padding] duration-200 ${
          collapsed ? "lg:pl-[64px]" : "lg:pl-[260px]"
        }`}
      >
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 min-h-[64px] max-h-[64px] shrink-0 border-b border-[#101828]/10 bg-[#F7F6F2]/90 backdrop-blur-md">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 overflow-hidden flex-nowrap">
            <div className="flex items-center gap-3 min-w-0 shrink">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-[#101828]/12 p-2 hover:bg-[#101828]/5 lg:hidden shrink-0"
              >
                <PanelLeft className="size-4 text-[#101828]/70" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#101828]/40 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span>{fmtDate(TODAY)}</span>
                  <span aria-hidden>·</span>
                  <span className="text-[#5146E5] font-bold shrink-0">{activeWorkspace?.label ?? "Privé"}</span>
                  {currentModule ? (
                    <>
                      <span aria-hidden>·</span>
                      <span className="text-[#101828]/70 font-medium truncate">{currentModule.label}</span>
                    </>
                  ) : null}
                </div>
                <div className="truncate text-xs sm:text-sm font-semibold text-[#101828]/80 leading-tight">
                  {activeWorkspace?.who ?? BRAND}
                </div>
              </div>
            </div>

            {/* Quick role switcher compact pills in header */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden lg:flex items-center gap-1 rounded-lg border border-[#101828]/10 bg-white p-1 text-xs shrink-0">
                {ROLE_PILLS.map((ws) => {
                  const isActive = ws.id === persona;
                  return (
                    <Link
                      key={ws.href}
                      to={ws.href}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#5146E5] text-white shadow-xs"
                          : "text-[#101828]/60 hover:bg-[#101828]/5 hover:text-[#101828]"
                      }`}
                    >
                      {ws.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCommandOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-[#101828]/12 bg-white px-3 py-1.5 text-xs font-medium text-[#101828]/70 hover:border-[#101828]/25 hover:bg-[#101828]/[0.03] shadow-xs transition-all"
                  title="Search modules or Ask Privé (Cmd+K)"
                >
                  <Search className="size-3.5 text-[#101828]/50" />
                  <span className="hidden md:inline">Search or Ask Privé...</span>
                  <kbd className="rounded border border-[#101828]/15 bg-[#101828]/5 px-1.5 py-0.5 text-[10px] font-bold text-[#101828]/70">
                    ⌘K
                  </kbd>
                </button>

                <span className="hidden items-center gap-1.5 rounded-full border border-[#0F9D8A]/30 bg-[#0F9D8A]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0B7A6C] md:inline-flex">
                  <Activity className="size-3.5" /> Live
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content with max-w-7xl container & Skeleton loading states */}
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <PageSkeleton />
          ) : (
            <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
          )}
        </main>
      </div>

      <AskPriveDrawer persona={persona} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
