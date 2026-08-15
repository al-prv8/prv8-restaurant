"use client";

import { PriveShell } from "@/components/prive/Shell";

export default function RegionalLayout({ children }: { children: React.ReactNode }) {
  return <PriveShell persona="regional">{children}</PriveShell>;
}
