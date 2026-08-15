import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PriveShell } from "@/components/prive/Shell";

export const Route = createFileRoute("/regional")({
  component: RegionalLayout,
});

function RegionalLayout() {
  return (
    <PriveShell persona="regional">
      <Outlet />
    </PriveShell>
  );
}
