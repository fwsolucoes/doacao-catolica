import type { Route } from "+/route.campaign.ambassadorsReport";
import { AmbassadorsReportPage } from "~/client/pages/ambassadorsReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getAmbassadorsDashboard } from "../factories/ambassadorsDashboard/getAmbassadorsDashboardFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const dashboard = await getAmbassadorsDashboard.handle(adaptedRoute);
  return { dashboard };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function AmbassadorsReportRoute() {
  return <AmbassadorsReportPage />;
}
