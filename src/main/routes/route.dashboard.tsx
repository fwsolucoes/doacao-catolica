import type { Route } from "+/route.dashboard";
import { redirect } from "react-router";
import { DashboardPage } from "~/client/pages/dashboardPage";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listCampaigns } from "../factories/campaing/listCampaingsFactory";
import { getPortalOverview } from "../factories/campaignOverview/getPortalOverviewFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaigns = await listCampaigns.handle(adaptedRoute);
  const firstCampaign = campaigns.data[0];
  if (!firstCampaign) return { overview: null };

  const accountUuid = firstCampaign.apiDonationPublicId ?? firstCampaign.id;
  const overview = await getPortalOverview.handle(String(accountUuid));

  return { overview };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function Dashboard() {
  return <DashboardPage />;
}
