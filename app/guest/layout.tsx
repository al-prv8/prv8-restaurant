"use client";

import { PriveShell } from "@/components/prive/Shell";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return <PriveShell persona="guest">{children}</PriveShell>;
}
