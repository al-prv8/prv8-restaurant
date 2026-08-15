import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PriveShell } from "@/components/prive/Shell";

export const Route = createFileRoute("/gm")({
  component: GmLayout,
});

function GmLayout() {
  return (
    <PriveShell persona="gm">
      <Outlet />
    </PriveShell>
  );
}
