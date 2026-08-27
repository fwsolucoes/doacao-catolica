import type { Route } from "+/route.campaign.shalonMetrics";
import { redirect } from "react-router";
import { ShalonMetricsPage } from "~/client/pages/shalonMetrics";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getShalonMetrics } from "../factories/shalonMetrics/getShalonMetricsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const metrics = await getShalonMetrics.handle(adaptedRoute);

  return { metrics };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function ShalonMetricsRoute() {
  return <ShalonMetricsPage />;
}
