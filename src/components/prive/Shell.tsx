"use client";

import { useState, useEffect, Suspense, type ReactNode } from "react";
import { usePrive, type Persona } from "@/lib/prive/store";
import { AskPriveDrawer } from "./AskPrive";
import { CommandPalette } from "./CommandPalette";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { PageSkeleton } from "./ui";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { HelpModal } from "./HelpModal";
import { ProfileDrawer } from "./ProfileDrawer";

function ShellInner({
  persona,
  children,
}: {
  persona: Persona;
  children: ReactNode;
}) {
  const { state, dispatch } = usePrive();
  const { state: sidebarState, setOpenMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);
  const [askPriveOpen, setAskPriveOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isCollapsed = sidebarState === "collapsed";

  // Auto-open drawer when a pending question is set
  useEffect(() => {
    if (state.pendingQuestion) setAskPriveOpen(true);
  }, [state.pendingQuestion]);

  return (
    <div className="relative min-h-screen w-full text-[#1C1917] bg-[#F7F5F2] antialiased font-sans">
      {/* Fixed TopNav Header — h-16 at top-0 z-30 */}
      <TopNav
        persona={persona}
        isSidebarCollapsed={isCollapsed}
        onOpenMobileSidebar={() => setOpenMobile(true)}
        onOpenSearch={() => setCommandOpen(true)}
        onOpenAskPrive={() => setAskPriveOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onResetDemo={() => dispatch({ type: "resetDemo" })}
      />

      {/* Fixed Left Dark Burgundy Sidebar Navigation */}
      <Sidebar />

      {/* Main content scroll canvas wrapped in SidebarInset */}
      <SidebarInset className="relative z-10 min-h-[calc(100vh-4rem)] pt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </div>
      </SidebarInset>

      <AskPriveDrawer
        open={askPriveOpen}
        onClose={() => setAskPriveOpen(false)}
        persona={persona}
      />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <HelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}

export function PriveShell({
  persona,
  children,
}: {
  persona: Persona;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <ShellInner persona={persona}>{children}</ShellInner>
    </SidebarProvider>
  );
}
