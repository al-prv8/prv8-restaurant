import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/regional/")({
  component: () => <Navigate to="/regional/portfolio" replace />,
});
