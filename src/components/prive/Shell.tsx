"use client";

import { useState, useEffect, Suspense, type ReactNode } from "react";
import { usePrive, type Persona } from "@/lib/prive/store";
import { AskPriveDrawer } from "./AskPrive";
import { CommandPalette } from "./CommandPalette";
import { TopNav } from "./TopNav";
import { PageSkeleton } from "./ui";

export function PriveShell({
  persona,
  children,
}: {
  persona: Persona;
  children: ReactNode;
}) {
  const { derived: d, state, dispatch } = usePrive();
  const [commandOpen, setCommandOpen] = useState(false);
  const [askPriveOpen, setAskPriveOpen] = useState(false);

  const personaLabels: Record<string, string> = {
    gm: "General Manager · Ballantyne #02",
    regional: "Regional Director · Carolinas Portfolio",
    executive: "C-Suite Executive · Carolinas Region",
    employee: "Employee Portal · Ballantyne #02",
    guest: "Guest Services · 24/7 Contact",
  };
  const label = personaLabels[persona] ?? persona;

  const readinessScore = d.readiness?.score ?? 0;
  const readinessColor =
    readinessScore >= 85
      ? "text-[#4ADE80]"
      : readinessScore >= 70
      ? "text-[#FBBF24]"
      : "text-[#F87171]";

  // Auto-open drawer when a pending question is set (e.g. from a quick-action chip)
  useEffect(() => {
    if (state.pendingQuestion) setAskPriveOpen(true);
  }, [state.pendingQuestion]);

  return (
    <div className="relative min-h-screen text-[#1C1917] bg-[#F7F5F2] overflow-x-hidden">
      {/* Fixed TopNav — h-16 (64px) at top-0 z-40 */}
      <TopNav
        persona={persona}
        onOpenSearch={() => setCommandOpen(true)}
        onOpenAskPrive={() => setAskPriveOpen(true)}
        onResetDemo={() => dispatch({ type: "resetDemo" })}
      />

      {/* Contextual subheader — fixed directly below TopNav (top-16), z-39 */}
      <div
        className="fixed inset-x-0 top-16 z-[39] border-b border-white/10 bg-[#1C1917]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-sm"
        style={{ height: "34px" }}
      >
        <div className="flex h-full items-center justify-between text-[11px] font-medium text-white/60">
          <span className="uppercase tracking-widest">{label}</span>
          {persona === "gm" && (
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-widest">Readiness</span>
              <span className={`rounded px-1.5 py-0.5 bg-white/10 font-bold tabular-nums ${readinessColor}`}>
                {readinessScore}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content — pt-28 = 64px TopNav + 34px subheader + 6px gap */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
      </main>

      <AskPriveDrawer
        persona={persona}
        open={askPriveOpen}
        onClose={() => setAskPriveOpen(false)}
      />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
