"use client";

import { GuestShell } from "@/components/prive/GuestShell";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return <GuestShell>{children}</GuestShell>;
}
