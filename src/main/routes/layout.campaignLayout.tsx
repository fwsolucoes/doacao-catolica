import type { Route } from "+/layout.campaignLayout";
import { redirect } from "react-router";
import { CampaignLayout } from "~/client/layouts/campaignLayout";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaignOverview } from "../factories/campaignOverview/getCampaignOverviewFactory";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { getProjectPermissions } from "../factories/projectPermissions/getProjectPermissionsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaign = await getCampaign.handle(adaptedRoute);

  const [overview, permissions] = await Promise.all([
    getCampaignOverview.handle(adaptedRoute),
    getProjectPermissions.handle(adaptedRoute, campaign.id),
  ]);

  return { campaign, overview, ...permissions };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default CampaignLayout;
