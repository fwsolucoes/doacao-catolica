import type { Route } from "+/route.campaign.ambassadorsReport";
import { AmbassadorsReportPage } from "~/client/pages/ambassadorsReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getAmbassadorsDashboard } from "../factories/ambassadorsDashboard/getAmbassadorsDashboardFactory";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { listAmbassadorRegions } from "../factories/ambassadorRegion/listAmbassadorRegionsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const campaign = await getCampaign.handle(adaptedRoute);
  const showRegionFilter = campaign.accountId === 82948;

  const [dashboard, regions] = await Promise.all([
    getAmbassadorsDashboard.handle(adaptedRoute),
    showRegionFilter
      ? listAmbassadorRegions.handle(adaptedRoute)
      : Promise.resolve([]),
  ]);

  return { dashboard, regions, showRegionFilter };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function AmbassadorsReportRoute() {
  return <AmbassadorsReportPage />;
}
