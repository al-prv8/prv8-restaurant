"use client";

import { PriveShell } from "@/components/prive/Shell";
import { ReactNode } from "react";

export default function IntegrationsLayout({ children }: { children: ReactNode }) {
  return <PriveShell persona="gm">{children}</PriveShell>;
}
