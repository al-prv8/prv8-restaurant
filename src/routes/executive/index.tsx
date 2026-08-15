import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/executive/")({
  component: () => <Navigate to="/executive/pulse" replace />,
});
