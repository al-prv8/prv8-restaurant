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
import { usePrive } from "@/lib/prive/store";

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
  const { derived: d } = usePrive();
  const router = useRouter();
  const { state, dispatch } = usePrive();
  const { state: sidebarState, setOpenMobile } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    OPERATIONS: true,
    TEAM: true,
    GUEST: true,
    ADMIN: true,
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

  const menuGroups: MenuGroup[] = [
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

  return (
    <SidebarPrimitive collapsible="icon">
      {/* ── SidebarHeader: Logo & Trigger (Trigger visible ONLY when expanded) ── */}
      <SidebarHeader>
        <Link href="/gm/home" className="flex items-center gap-3 overflow-hidden">
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
              href="/gm/home"
              isActive={pathname === "/gm/home"}
              tooltip="Overview"
              onClick={() => setOpenMobile(false)}
            >
              <Home
                className={`size-4 shrink-0 ${
                  pathname === "/gm/home" ? "text-white" : "text-white/50"
                }`}
              />
              {!isCollapsed && (
                <span className="flex-1 truncate text-left">Overview</span>
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
                          href={hasSubItems ? undefined : item.href}
                          isActive={isActive}
                          tooltip={item.label}
                          onClick={() => {
                            if (hasSubItems) {
                              toggleSubMenu(item.label);
                            } else {
                              setOpenMobile(false);
                            }
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

      {/* ── SidebarFooter: Profile Card & Logout Button ────────────────── */}
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/gm/workforce"
            onClick={() => setOpenMobile(false)}
            className={`flex flex-1 items-center gap-3 group transition-colors min-w-0 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative grid size-9 shrink-0 place-items-center rounded-full bg-[#6B142B] text-[#FFFFFF] overflow-hidden border border-white/20">
              <User className="size-5" />
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-[#4ADE80] ring-1 ring-[#3B0A1A]" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-white group-hover:text-white/80">
                  Jordan Ellis
                </div>
                <div className="truncate text-[10px] font-medium text-white/50">
                  General Manager
                </div>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "logout" });
                router.push("/login");
              }}
              className="flex size-7 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Log out"
            >
              <LogOut className="size-3.5" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
