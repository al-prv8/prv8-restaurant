import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/employee/")({
  component: () => <Navigate to="/employee/home" replace />,
});
