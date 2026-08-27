import type { Route } from "+/layout.campaignLayout";
import { redirect } from "react-router";
import { PROJECT_ALL_PERMISSIONS } from "~/app/template/PROJECT_ALL_PERMISSIONS";
import { CampaignLayout } from "~/client/layouts/campaignLayout";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaignOverview } from "../factories/campaignOverview/getCampaignOverviewFactory";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { getProjectPermissions } from "../factories/projectPermissions/getProjectPermissionsFactory";
import { getPaymentMetrics } from "../factories/paymentMetrics/getPaymentMetricsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaign = await getCampaign.handle(adaptedRoute);
  const isOwner = user.accountId === campaign.accountId;
  const isSuperUser = user.id === "14692";
  const isMonthlyType = campaign.typeDonation === "BOTH" || campaign.typeDonation === "MONTHLY";

  const [overview, permissions, metrics] = await Promise.all([
    getCampaignOverview.handle(adaptedRoute),
    isOwner || isSuperUser
      ? Promise.resolve({
          projectRole: { name: "Administrador" },
          projectPermissions: [...PROJECT_ALL_PERMISSIONS] as string[],
        })
      : getProjectPermissions.handle(adaptedRoute, campaign.id),
    isMonthlyType ? getPaymentMetrics.handle(adaptedRoute) : Promise.resolve(null),
  ]);

  return { campaign, overview, ...permissions, bannerTotalReceived: metrics?.released ?? null };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default CampaignLayout;
