import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PriveShell } from "@/components/prive/Shell";

export const Route = createFileRoute("/guest")({
  component: GuestLayout,
});

function GuestLayout() {
  return (
    <PriveShell persona="guest">
      <Outlet />
    </PriveShell>
  );
}
