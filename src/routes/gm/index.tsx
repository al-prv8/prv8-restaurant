import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/gm/")({
  component: () => <Navigate to="/gm/home" replace />,
});
