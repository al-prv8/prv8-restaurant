"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  TrendingUp,
  Users,
  Package,
  Calendar,
  ShieldCheck,
  BarChart3,
  UserPlus,
  CreditCard,
  MessageSquare,
  MessageSquareHeart,
  FileText,
  Folder,
  Settings,
  ChevronDown,
  User,
  Bell,
  LogOut,
  BrainCircuit,
  Award,
  Sparkles,
  Truck,
  Sliders,
  LifeBuoy,
} from "lucide-react";
import {
  Sidebar as SidebarPrimitive,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePrive, type Persona } from "@/lib/prive/store";

export interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  subItems?: Array<{ label: string; href: string }>;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, derived: d, dispatch } = usePrive();
  const { state: sidebarState, setOpenMobile } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const persona: Persona = state.persona || "gm";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    OPERATIONS: true,
    TEAM: true,
    GUEST: true,
    ADMIN: true,
    MY_PORTAL: true,
    PORTFOLIO: true,
    ENTERPRISE: true,
  });

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const openComplaintsCount = d.gmComplaints.filter(
    (c) => c.status === "Awaiting Approval"
  ).length;

  // Overview top link per persona
  const overviewHrefs: Record<Persona, { href: string; label: string }> = {
    gm: { href: "/gm/home", label: "Overview" },
    employee: { href: "/employee/home", label: "Employee Home" },
    regional: { href: "/regional/portfolio", label: "Carolinas Portfolio" },
    executive: { href: "/executive/pulse", label: "Enterprise Pulse" },
    guest: { href: "/guest/service", label: "Guest Service" },
  };

  const currentOverview = overviewHrefs[persona] || overviewHrefs.gm;

  // Per-persona dynamic menu groups
  let menuGroups: MenuGroup[] = [];

  if (persona === "gm") {
    menuGroups = [
      {
        title: "OPERATIONS",
        items: [
          { label: "Sales", href: "/gm/sales", icon: TrendingUp },
          { label: "Labor", href: "/gm/staffing", icon: Users },
          { label: "Inventory", href: "/gm/inventory", icon: Package },
          {
            label: "Scheduling",
            href: "/gm/schedule",
            icon: Calendar,
            subItems: [
              { label: "Master Roster", href: "/gm/schedule" },
              { label: "Employee Pickup", href: "/employee/schedule" },
            ],
          },
          { label: "Compliance", href: "/gm/compliance", icon: ShieldCheck },
          { label: "Store Performance", href: "/gm/performance", icon: BarChart3 },
        ],
      },
      {
        title: "TEAM",
        items: [
          { label: "Team Members", href: "/gm/workforce", icon: Users },
          { label: "Hiring & Onboarding", href: "/gm/hiring", icon: UserPlus },
          { label: "Payroll", href: "/gm/payroll", icon: CreditCard },
        ],
      },
      {
        title: "GUEST",
        items: [
          {
            label: "Guest Issues",
            href: "/gm/guests",
            icon: MessageSquare,
            badge: openComplaintsCount > 0 ? openComplaintsCount : 4,
            subItems: [
              { label: "Pending Approvals", href: "/gm/guests" },
              { label: "Recovery Credits", href: "/guest/credits" },
            ],
          },
          { label: "Guest Feedback", href: "/gm/feedback", icon: MessageSquareHeart },
        ],
      },
      {
        title: "ADMIN",
        items: [
          { label: "Communications", href: "/gm/communications", icon: Bell },
          { label: "Reports & Audit", href: "/gm/reports", icon: FileText },
          { label: "Documents", href: "/gm/documents", icon: Folder },
          { label: "Settings", href: "/gm/settings", icon: Settings },
        ],
      },
    ];
  } else if (persona === "employee") {
    menuGroups = [
      {
        title: "MY PORTAL",
        items: [
          { label: "My Shift & Roster", href: "/employee/schedule", icon: Calendar },
          { label: "Training & ServSafe", href: "/employee/training", icon: Award },
          { label: "Announcements & SOP", href: "/employee/announcements", icon: FileText },
        ],
      },
    ];
  } else if (persona === "regional") {
    menuGroups = [
      {
        title: "PORTFOLIO",
        items: [
          { label: "12-Store Portfolio", href: "/regional/portfolio", icon: Building2Icon },
          { label: "Intelligence Console", href: "/regional/intelligence", icon: BrainCircuit },
          { label: "Regional Supply Chain", href: "/regional/supply-chain", icon: Truck },
        ],
      },
    ];
  } else if (persona === "executive") {
    menuGroups = [
      {
        title: "ENTERPRISE",
        items: [
          { label: "Enterprise Pulse", href: "/executive/pulse", icon: TrendingUp },
          { label: "What-If Scenario Engine", href: "/executive/scenario", icon: Sliders },
          { label: "Portfolio Health", href: "/executive/portfolio", icon: BarChart3 },
        ],
      },
    ];
  } else if (persona === "guest") {
    menuGroups = [
      {
        title: "GUEST SERVICES",
        items: [
          { label: "AI Service Intake", href: "/guest/service", icon: MessageSquare },
          { label: "Recovery Credits", href: "/guest/credits", icon: CreditCard },
        ],
      },
    ];
  }

  return (
    <SidebarPrimitive collapsible="icon">
      {/* ── SidebarHeader: Logo & Trigger ───────────────────────────── */}
      <SidebarHeader>
        <Link href={currentOverview.href} className="flex items-center gap-3 overflow-hidden">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#881337] font-black text-white text-base shadow-xs border border-white/20">
            P
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-extrabold tracking-[0.18em] text-white leading-none">
                PRIVÉ
              </div>
              <div className="text-[9px] font-bold tracking-[0.12em] text-white/50 uppercase leading-tight mt-0.5 truncate">
                RESTAURANT INTELLIGENCE
              </div>
            </div>
          )}
        </Link>

        {/* Toggle Icon in Sidebar Header (Visible only when expanded) */}
        {!isCollapsed && (
          <SidebarTrigger className="text-white/60 hover:bg-white/10 hover:text-white" />
        )}
      </SidebarHeader>

      {/* ── SidebarContent: Scrollable Navigation ─────────────────────── */}
      <SidebarContent>
        {/* Separated Top Overview Item */}
        <SidebarMenu className="mb-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              href={currentOverview.href}
              isActive={pathname === currentOverview.href}
              tooltip={currentOverview.label}
              onClick={() => setOpenMobile(false)}
            >
              <Home
                className={`size-4 shrink-0 ${
                  pathname === currentOverview.href ? "text-white" : "text-white/50"
                }`}
              />
              {!isCollapsed && (
                <span className="flex-1 truncate text-left">{currentOverview.label}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Category Groups */}
        {menuGroups.map((group) => {
          const isGroupOpen = openGroups[group.title] ?? true;

          return (
            <SidebarGroup key={group.title}>
              {!isCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 hover:text-white/70 transition-colors"
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    className={`size-3 transition-transform duration-200 ${
                      isGroupOpen ? "" : "-rotate-90 opacity-40"
                    }`}
                  />
                </button>
              ) : (
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              )}

              {(isGroupOpen || isCollapsed) && (
                <SidebarMenu>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/gm/home" && pathname.startsWith(item.href));
                    const hasSubItems = !!(item.subItems && item.subItems.length > 0);
                    const isSubOpen = openSubMenus[item.label] ?? false;

                    return (
                      <SidebarMenuItem key={item.label + item.href}>
                        <SidebarMenuButton
                          href={item.href}
                          isActive={isActive}
                          tooltip={item.label}
                          onClick={() => {
                            if (hasSubItems) {
                              toggleSubMenu(item.label);
                            }
                            setOpenMobile(false);
                          }}
                        >
                          <Icon
                            className={`size-4 shrink-0 ${
                              isActive ? "text-white" : "text-white/50"
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="flex-1 truncate text-left">
                              {item.label}
                            </span>
                          )}
                          {!isCollapsed && item.badge ? (
                            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                          ) : null}
                          {!isCollapsed && hasSubItems && (
                            <ChevronDown
                              className={`size-3.5 shrink-0 text-white/40 transition-transform duration-200 ${
                                isSubOpen ? "rotate-180 text-white" : ""
                              }`}
                            />
                          )}
                        </SidebarMenuButton>

                        {!isCollapsed && hasSubItems && isSubOpen && (
                          <SidebarMenuSub>
                            {item.subItems!.map((sub) => (
                              <SidebarMenuSubItem key={sub.label + sub.href}>
                                <SidebarMenuSubButton
                                  href={sub.href}
                                  isActive={pathname === sub.href}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  {sub.label}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* ── SidebarFooter: Profile Card & Logout Button ───────────────── */}
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <div className="relative grid size-8 shrink-0 place-items-center rounded-full bg-[#881337] text-white font-black text-xs border border-white/20">
            JE
            <span className="absolute bottom-0 right-0 size-2 rounded-full bg-[#4ADE80] ring-1 ring-[#1C070D]" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                Jordan Ellis
              </div>
              <div className="text-[10px] text-white/50 truncate">
                General Manager
              </div>
            </div>
          )}

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "logout" });
                router.push("/login");
              }}
              className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="size-4 text-[#FB7185]" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
