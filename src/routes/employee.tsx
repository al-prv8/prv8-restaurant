import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PriveShell } from "@/components/prive/Shell";

export const Route = createFileRoute("/employee")({
  component: EmployeeLayout,
});

function EmployeeLayout() {
  return (
    <PriveShell persona="employee">
      <Outlet />
    </PriveShell>
  );
}
