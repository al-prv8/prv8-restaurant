"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  Menu,
  User,
  Store,
  UserRound,
  Building2,
  TrendingUp,
  MessageSquareHeart,
  LogOut,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { usePrive, type Persona } from "@/lib/prive/store";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopNav({
  persona,
  isSidebarCollapsed = false,
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenAskPrive,
  onOpenNotifications,
  onOpenHelp,
  onOpenProfile,
  onOpenDemoConfig,
  onResetDemo,
}: {
  persona: Persona;
  isSidebarCollapsed?: boolean;
  onOpenMobileSidebar?: () => void;
  onOpenSearch?: () => void;
  onOpenAskPrive?: () => void;
  onOpenNotifications?: () => void;
  onOpenHelp?: () => void;
  onOpenProfile?: () => void;
  onOpenDemoConfig?: () => void;
  onResetDemo?: () => void;
}) {
  const router = useRouter();
  const { state, derived: d, dispatch } = usePrive();
  const cfg = state.demoConfig;
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const storeDropdownRef = useRef<HTMLDivElement>(null);

  const roles = [
    { id: "gm", label: "General Manager", who: "Operations, Labor & Inventory", href: "/gm/home", icon: User },
    { id: "employee", label: "Employee", who: "Shift Roster & Training", href: "/employee/home", icon: UserRound },
    { id: "regional", label: "Regional Director", who: "Carolinas 12-Store Portfolio", href: "/regional/portfolio", icon: Building2 },
    { id: "executive", label: "C-Suite Executive", who: "Enterprise Pulse & Scenarios", href: "/executive/pulse", icon: TrendingUp },
    { id: "guest", label: "Guest Services", who: "AI Service Intake & Recovery", href: "/guest/service", icon: MessageSquareHeart },
  ];

  const currentRole = roles.find((r) => r.id === persona) ?? roles[0];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (storeDropdownRef.current && !storeDropdownRef.current.contains(e.target as Node)) {
        setStoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSelect = (role: (typeof roles)[0]) => {
    dispatch({ type: "persona", persona: role.id as Persona });
    setRoleDropdownOpen(false);
    router.push(role.href);
  };

  const notificationCount = d.alerts?.length || 4;

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-30 h-16 border-b border-[#E7E5E0] bg-white px-4 sm:px-6 transition-all duration-300 ${
        isSidebarCollapsed ? "lg:left-[72px]" : "lg:left-60"
      }`}
    >
      <div className="mx-auto flex h-full items-center justify-between">
        {/* Left Section: Mobile Menu Toggle + Transferred Desktop Expand Button + Store Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Sidebar Toggle Button */}
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="flex size-9 items-center justify-center rounded-lg border border-[#E7E5E0] bg-[#F7F5F2] text-[#1C1917] hover:bg-[#E7E5E0] lg:hidden cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="size-4" />
          </button>

          {/* Transferred Desktop Expand Button when Sidebar is Collapsed */}
          {isSidebarCollapsed && (
            <SidebarTrigger className="hidden lg:flex size-9 border-[#E7E5E0] bg-[#FAFAF8] text-[#1C1917] hover:bg-[#E7E5E0] hover:text-[#881337]" />
          )}

          {/* Store Switcher Dropdown */}
          <div ref={storeDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setStoreDropdownOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-lg px-3 py-1.5 text-left border border-[#E7E5E0] bg-[#FAFAF8] hover:bg-[#E7E5E0] transition-colors cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black text-[#1C1917]">
                  <span className="uppercase">{cfg.companyName} · {cfg.location}</span>
                  <ChevronDown className="size-3.5 text-[#78716C]" />
                </div>
              </div>
            </button>

            {/* Store Dropdown menu */}
            {storeDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl border border-[#E7E5E0] bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  Select Location
                </div>
                {d.health?.map((h) => {
                  const isSelected = h.restaurant.id === state.regionalRestaurantId;
                  return (
                    <button
                      key={h.restaurant.id}
                      type="button"
                      onClick={() => {
                        dispatch({ type: "regionalRestaurant", id: h.restaurant.id });
                        setStoreDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                        isSelected
                          ? "bg-[#881337]/8 text-[#881337]"
                          : "text-[#1C1917] hover:bg-[#F7F5F2]"
                      }`}
                    >
                      <div>
                        <div className="font-bold">{h.restaurant.name}</div>
                        <div className="text-[10px] font-medium text-[#78716C]">
                          {h.restaurant.city}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold tabular-nums rounded px-1.5 py-0.5 ${
                          h.score >= 85
                            ? "bg-[#15803D]/10 text-[#15803D]"
                            : h.score >= 70
                            ? "bg-[#B45309]/10 text-[#B45309]"
                            : "bg-[#B91C1C]/10 text-[#B91C1C]"
                        }`}
                      >
                        {h.score} pts
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Search Bar linked to Command Palette */}
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex h-9 items-center gap-2.5 rounded-xl border border-[#E7E5E0] bg-[#FAFAF8] px-3.5 text-xs font-medium text-[#78716C] hover:bg-[#F7F5F2] hover:border-[#881337]/30 transition-all w-60 lg:w-76 shadow-xs group cursor-pointer"
          >
            <Search className="size-4 text-[#78716C] group-hover:text-[#881337]" />
            <span className="flex-1 text-left truncate">Search metrics, shifts, SOPs...</span>
            <kbd className="rounded border border-[#E7E5E0] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#1C1917] shadow-xs">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Right Section: Persona Role Switcher + Notification Bell + Help + Demo Config + Profile Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Ask Privé Button */}
          {onOpenAskPrive && persona !== "guest" && (
            <button
              type="button"
              onClick={onOpenAskPrive}
              className="hidden lg:flex h-9 items-center gap-1.5 rounded-lg border border-[#881337]/30 bg-[#881337]/5 px-3 text-xs font-bold text-[#881337] hover:bg-[#881337]/10 transition-colors cursor-pointer"
            >
              <span className="text-xs">✦</span>
              <span>Ask Privé</span>
            </button>
          )}

          {/* Demo Config Preset Button */}
          {onOpenDemoConfig && (
            <button
              type="button"
              onClick={onOpenDemoConfig}
              className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] px-3 text-xs font-semibold text-[#1C1917] hover:bg-[#E7E5E0] hover:text-[#881337] transition-colors cursor-pointer"
              title="Configure Prospect & Restaurant"
            >
              <SlidersHorizontal className="size-4 text-[#881337]" />
              <span>Config</span>
            </button>
          )}

          {/* Persona / Role Switcher */}
          <div ref={roleDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-lg border border-[#E7E5E0] bg-[#FAFAF8] px-3 text-xs font-semibold text-[#1C1917] hover:bg-[#E7E5E0] transition-colors cursor-pointer"
            >
              <span className="text-[#78716C] font-normal hidden sm:inline">
                View as:
              </span>
              <User className="size-4 text-[#1C1917]" />
              <span className="font-bold">{currentRole.label}</span>
              <ChevronDown className="size-3.5 text-[#78716C]" />
            </button>

            {/* Role Dropdown Menu */}
            {roleDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl border border-[#E7E5E0] bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  Switch Dashboard Persona
                </div>
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = r.id === persona;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-[#881337]/8 text-[#881337] font-bold"
                          : "text-[#1C1917] hover:bg-[#F7F5F2] font-medium"
                      }`}
                    >
                      <Icon
                        className={`size-4 ${
                          isSelected ? "text-[#881337]" : "text-[#78716C]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold leading-tight">{r.label}</div>
                        <div className="text-[10px] text-[#78716C] truncate mt-0.5">
                          {r.who}
                        </div>
                      </div>
                    </button>
                  );
                })}

                <div className="my-1 border-t border-[#E7E5E0]" />
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "logout" });
                    setRoleDropdownOpen(false);
                    router.push("/login");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-bold text-[#B91C1C] hover:bg-[#B91C1C]/10 transition-colors cursor-pointer"
                >
                  <LogOut className="size-4 text-[#B91C1C]" />
                  <span>Log out of Privé</span>
                </button>
              </div>
            )}
          </div>

          {/* Bell Notification Icon with Badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative flex size-9 items-center justify-center rounded-lg bg-[#FAFAF8] border border-[#E7E5E0] text-[#1C1917] hover:bg-[#E7E5E0] transition-colors cursor-pointer"
            title="Notifications & Priority Alerts"
          >
            <Bell className="size-4 text-[#1C1917]" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#B91C1C] text-[9px] font-black text-white shadow-xs">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Help / Info Icon */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="flex size-9 items-center justify-center rounded-lg bg-[#FAFAF8] border border-[#E7E5E0] text-[#1C1917] hover:bg-[#E7E5E0] transition-colors cursor-pointer"
            title="Help & Operations Guides"
          >
            <HelpCircle className="size-4 text-[#1C1917]" />
          </button>

          {/* Profile Avatar Icon */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative grid size-9 place-items-center rounded-full bg-[#881337] text-white font-black text-xs border border-white/20 shadow-xs hover:scale-105 transition-all cursor-pointer"
            title={`${cfg.firstName} (Manager Profile)`}
          >
            {cfg.firstName.slice(0, 2).toUpperCase()}
            <span className="absolute bottom-0 right-0 size-2 rounded-full bg-[#4ADE80] ring-1 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
