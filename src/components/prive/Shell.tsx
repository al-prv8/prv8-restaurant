"use client";

import { useState, Suspense, type ReactNode } from "react";
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
  const { derived: d, dispatch } = usePrive();
  const [commandOpen, setCommandOpen] = useState(false);

  const personaLabels: Record<string, string> = {
    gm: "General Manager · Ballantyne #02",
    regional: "Regional Director · Carolinas Portfolio",
    executive: "C-Suite Executive · Carolinas Region",
    employee: "Employee Portal · Ballantyne #02",
    guest: "Guest Services · 24/7 AI Contact",
  };
  const label = personaLabels[persona] ?? persona;

  const readinessScore = d.readiness?.score ?? 0;
  const readinessColor =
    readinessScore >= 85
      ? "text-[#4ADE80]"
      : readinessScore >= 70
      ? "text-[#FBBF24]"
      : "text-[#F87171]";

  return (
    <div className="relative min-h-screen text-[#1C1917] bg-[#F4EFEA] overflow-x-hidden">
      {/* ── Ambient Background Orbs for Glassmorphic Refraction ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 size-[550px] rounded-full bg-[#881337]/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 size-[500px] rounded-full bg-[#B45309]/12 blur-[120px]" />
        <div className="absolute -bottom-24 left-1/3 size-[600px] rounded-full bg-[#15803D]/10 blur-[130px]" />
        <div className="absolute top-2/3 left-10 size-[400px] rounded-full bg-[#881337]/10 blur-[110px]" />
      </div>

      {/* Fixed TopNav — h-16 (64px) at top-0 z-40 */}
      <TopNav
        persona={persona}
        onOpenSearch={() => setCommandOpen(true)}
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

      <AskPriveDrawer persona={persona} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
