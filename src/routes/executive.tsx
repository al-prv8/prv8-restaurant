import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PriveShell } from "@/components/prive/Shell";

export const Route = createFileRoute("/executive")({
  component: ExecutiveLayout,
});

function ExecutiveLayout() {
  return (
    <PriveShell persona="executive">
      <Outlet />
    </PriveShell>
  );
}
