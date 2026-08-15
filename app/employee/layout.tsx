"use client";

import { PriveShell } from "@/components/prive/Shell";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <PriveShell persona="employee">{children}</PriveShell>;
}
