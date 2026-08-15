"use client";

import { PriveShell } from "@/components/prive/Shell";

export default function ExecutiveLayout({ children }: { children: React.ReactNode }) {
  return <PriveShell persona="executive">{children}</PriveShell>;
}
