"use client";

import { PriveShell } from "@/components/prive/Shell";

export default function GmLayout({ children }: { children: React.ReactNode }) {
  return <PriveShell persona="gm">{children}</PriveShell>;
}
