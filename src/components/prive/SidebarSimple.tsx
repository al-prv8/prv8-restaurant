import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft, type LucideIcon } from "lucide-react";

export interface NavItemType {
  id?: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string | React.ReactNode;
  items?: NavItemType[];
}

export interface SidebarNavigationSimpleProps {
  items: NavItemType[];
  footerItems?: NavItemType[];
  featureCard?: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onResetDemo?: () => void;
}

export function SidebarNavigationSimple({
  items,
  footerItems = [],
  featureCard,
  collapsed = false,
  onToggleCollapse,
  onResetDemo,
}: SidebarNavigationSimpleProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Accordion expanded state for items with sub-items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.items && pathname.startsWith(item.href)) {
        initial[item.href] = true;
      }
    });
    return initial;
  });

  const toggleExpand = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden shrink-0 border-r border-[#101828]/10 bg-white text-[#101828] transition-[width] duration-200 lg:flex lg:flex-col ${
        collapsed ? "w-[64px]" : "w-[260px]"
      }`}
    >
      {/* Sidebar Header / Brand (Untitled UI pattern) */}
      <div className="flex h-16 min-h-[64px] max-h-[64px] shrink-0 items-center gap-3 px-4 border-b border-[#101828]/10">
        <Link
          to="/"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#5146E5] text-base font-extrabold text-white shadow-md shadow-[#5146E5]/30"
        >
          P
        </Link>
        {!collapsed ? (
          <Link to="/" className="min-w-0">
            <div className="text-[15px] font-extrabold leading-tight tracking-tight text-[#101828]">
              PRIVÉ
            </div>
            <div className="truncate text-[11px] font-medium text-[#101828]/50">
              Restaurant Intelligence
            </div>
          </Link>
        ) : null}
      </div>

      {/* Primary Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {!collapsed ? (
          <p className="px-2 pb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#101828]/40">
            Navigation
          </p>
        ) : null}

        {items.map((item) => {
          const isActive = pathname === item.href || (item.id && pathname.startsWith(`/${item.id}`));
          const hasSubItems = item.items && item.items.length > 0;
          const isExpanded = isActive || (expandedItems[item.href] ?? false);
          const Icon = item.icon;

          return (
            <div key={item.href} className="rounded-xl transition-all">
              <Link
                to={item.href}
                title={item.label}
                onClick={() => {
                  if (hasSubItems) {
                    setExpandedItems((prev) => ({ ...prev, [item.href]: true }));
                  }
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold transition-all min-w-0 ${
                  isActive
                    ? "bg-[#5146E5] text-white shadow-sm shadow-[#5146E5]/20"
                    : "text-[#101828]/70 hover:bg-[#101828]/5 hover:text-[#101828]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </div>

                {!collapsed ? (
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge !== undefined ? (
                      typeof item.badge === "object" ? (
                        item.badge
                      ) : (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-[10px] font-extrabold text-[#101828] tabular-nums shadow-sm">
                          {item.badge}
                        </span>
                      )
                    ) : null}

                    {hasSubItems ? (
                      <ChevronRight
                        className={`size-3.5 transition-transform duration-200 ${
                          isExpanded
                            ? isActive
                              ? "rotate-90 text-white"
                              : "rotate-90 text-[#101828]"
                            : isActive
                            ? "text-white/80"
                            : "text-[#101828]/40"
                        }`}
                      />
                    ) : null}
                  </div>
                ) : null}
              </Link>

              {/* Accordion Dropdown Sub-Items */}
              {isExpanded && !collapsed && hasSubItems ? (
                <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-[#101828]/10 pl-2.5">
                  {item.items!.map((sub) => {
                    const SubIcon = sub.icon;
                    const subActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all ${
                          subActive
                            ? "bg-[#5146E5]/10 text-[#5146E5] font-bold"
                            : "text-[#101828]/60 hover:bg-[#101828]/5 hover:text-[#101828]"
                        }`}
                      >
                        <SubIcon className="size-3.5 shrink-0 opacity-70" aria-hidden />
                        <span className="truncate flex-1">{sub.label}</span>
                        {sub.badge ? (
                          typeof sub.badge === "object" ? (
                            sub.badge
                          ) : (
                            <span className="rounded-full bg-[#101828]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#101828]">
                              {sub.badge}
                            </span>
                          )
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}

        {/* Feature Card Slot */}
        {!collapsed && featureCard ? <div className="mx-0.5 mt-4">{featureCard}</div> : null}
      </nav>

      {/* Footer Navigation Items */}
      <div className="space-y-1.5 border-t border-[#101828]/10 px-3 py-3 bg-[#FAFAFC]">
        {onResetDemo && !collapsed ? (
          <button
            type="button"
            onClick={onResetDemo}
            className="w-full rounded-lg border border-[#101828]/10 bg-white px-3 py-2 text-[12px] font-medium text-[#101828]/60 hover:bg-[#101828]/5 hover:text-[#101828] text-left flex items-center justify-between shadow-xs transition-all"
          >
            <span>Reset Demo State</span>
            <span className="text-[10px] font-semibold text-[#101828]/40">61% Baseline</span>
          </button>
        ) : null}

        {footerItems.map((fItem) => {
          const FIcon = fItem.icon;
          const isFActive = pathname === fItem.href;

          return (
            <Link
              key={fItem.href}
              to={fItem.href}
              title={fItem.label}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12px] font-medium transition-all ${
                isFActive
                  ? "bg-[#5146E5] text-white"
                  : "text-[#101828]/70 hover:bg-[#101828]/5 hover:text-[#101828]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FIcon className="size-4 shrink-0" />
                {!collapsed ? <span className="truncate">{fItem.label}</span> : null}
              </div>
              {!collapsed && fItem.badge ? fItem.badge : null}
            </Link>
          );
        })}

        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-[#101828]/50 hover:bg-[#101828]/5 hover:text-[#101828] flex transition-all"
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            {!collapsed ? "Collapse Sidebar" : null}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
