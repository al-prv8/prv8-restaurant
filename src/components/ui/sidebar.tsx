"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type CSSProperties,
} from "react";
import Link from "next/link";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
} from "lucide-react";

const SIDEBAR_KEYBOARD_SHORTCUT = "b";

interface SidebarContextType {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className = "",
  style,
  children,
}: SidebarProviderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [open, setOpenProp]
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  }, [isMobile, setOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";

  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={style}
        className={`group/sidebar-wrapper flex min-h-svh w-full text-[#1C1917] ${className}`}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  className = "",
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <aside
        className={`flex h-full w-60 flex-col bg-[#3B0A1A] text-white ${className}`}
        {...props}
      >
        {children}
      </aside>
    );
  }

  return (
    <>
      {/* Desktop Sidebar Panel */}
      <aside
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        className={`fixed bottom-0 top-0 z-40 hidden lg:block transition-all duration-300 ${
          side === "left" ? "left-0" : "right-0"
        } ${state === "collapsed" ? "w-[72px]" : "w-60"} ${className}`}
        {...props}
      >
        <div className="relative flex h-full flex-col bg-[#3B0A1A] text-white border-r border-white/10 shadow-xl overflow-hidden">
          {children}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobile && openMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setOpenMobile(false)}
          />
          <div
            className={`absolute inset-y-0 ${
              side === "left" ? "left-0" : "right-0"
            } z-10 w-60 bg-[#3B0A1A] text-white shadow-2xl flex flex-col border-r border-white/10`}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export function SidebarHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 bg-[#3B0A1A] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`shrink-0 border-t border-white/10 bg-black/15 p-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex-1 overflow-y-auto px-2 py-3 custom-sidebar-scroll ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroup({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`py-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();
  if (state === "collapsed") {
    return <div className="mx-auto my-1.5 h-px w-8 bg-white/10" />;
  }

  return (
    <div
      className={`px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarMenu({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenuItem({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`group relative ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  asChild?: boolean;
  tooltip?: string;
  href?: string;
}

export function SidebarMenuButton({
  isActive = false,
  tooltip,
  href,
  className = "",
  children,
  onClick,
  ...props
}: SidebarMenuButtonProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const baseClasses = `flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all ${
    isActive
      ? "bg-[#6B142B] font-semibold text-white shadow-sm"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  } ${isCollapsed ? "justify-center px-0 py-2.5" : ""} ${className}`;

  const content = (
    <>
      {children}
      {isCollapsed && tooltip && (
        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 rounded-lg border border-white/15 bg-[#1C1917] px-3 py-1.5 text-xs font-bold text-white shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses} {...props}>
      {content}
    </button>
  );
}

export function SidebarMenuSub({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();
  if (state === "collapsed") return null;

  return (
    <div
      className={`ml-5 mt-1 space-y-1 border-l border-white/15 pl-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarMenuSubItem({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`${className}`}>{children}</div>;
}

export function SidebarMenuSubButton({
  isActive = false,
  href,
  className = "",
  children,
  onClick,
  ...props
}: {
  isActive?: boolean;
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-md px-2 py-1 text-xs font-medium transition-colors ${
        isActive
          ? "font-bold text-white bg-white/10"
          : "text-white/60 hover:text-white hover:bg-white/5"
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function SidebarMenuBadge({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const { state } = useSidebar();
  if (state === "collapsed") return null;

  return (
    <span
      className={`flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold bg-[#B91C1C] text-white ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function SidebarTrigger({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar, state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={`group/trigger flex size-8 items-center justify-center rounded-lg border transition-all shadow-xs active:scale-95 cursor-pointer ${
        className
          ? className
          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white"
      }`}
      title={isExpanded ? "Collapse Sidebar (Cmd+B)" : "Expand Sidebar (Cmd+B)"}
      {...props}
    >
      {isExpanded ? (
        <ChevronsLeft className="size-4 transition-transform duration-200 group-hover/trigger:-translate-x-0.5" />
      ) : (
        <ChevronsRight className="size-4 transition-transform duration-200 group-hover/trigger:translate-x-0.5" />
      )}
    </button>
  );
}

/* ── Edge Floating Rail Toggle Badge (Raycast / Linear style) ────────── */
export function SidebarRail() {
  const { toggleSidebar, state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="absolute right-0 top-20 z-50 hidden translate-x-1/2 lg:flex size-5 items-center justify-center rounded-full bg-[#881337] text-white border border-white/30 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
      title={isExpanded ? "Collapse Sidebar (Cmd+B)" : "Expand Sidebar (Cmd+B)"}
    >
      {isExpanded ? (
        <ChevronLeft className="size-3" />
      ) : (
        <ChevronRight className="size-3" />
      )}
    </button>
  );
}

export function SidebarInset({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();

  return (
    <div
      className={`flex-1 transition-[padding] duration-300 ${
        state === "collapsed" ? "lg:pl-[72px]" : "lg:pl-60"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
