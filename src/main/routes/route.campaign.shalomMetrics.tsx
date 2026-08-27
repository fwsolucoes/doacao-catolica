import type { Route } from "+/route.campaign.shalomMetrics";
import { redirect } from "react-router";
import { ShalomMetricsPage } from "~/client/pages/shalomMetrics";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getShalomMetrics } from "../factories/shalomMetrics/getShalomMetricsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const metrics = await getShalomMetrics.handle(adaptedRoute);

  return { metrics };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function ShalomMetricsRoute() {
  return <ShalomMetricsPage />;
}
