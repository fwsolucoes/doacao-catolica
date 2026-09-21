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

  let campaign: Awaited<ReturnType<typeof getCampaign.handle>>;
  try {
    campaign = await getCampaign.handle(adaptedRoute);
  } catch {
    throw redirect("/my-campaigns?noPermission=true");
  }

  const isOwner = user.accountId === campaign.accountId;
  const isSuperUser = user.id === "14692";
  const isMonthlyType = campaign.typeDonation === "BOTH" || campaign.typeDonation === "MONTHLY";

  let permissions: Awaited<ReturnType<typeof getProjectPermissions.handle>>;
  try {
    permissions = isOwner || isSuperUser
      ? { projectRole: { name: "Administrador" }, projectPermissions: [...PROJECT_ALL_PERMISSIONS] as string[] }
      : await getProjectPermissions.handle(adaptedRoute, campaign.id);
  } catch {
    throw redirect("/my-campaigns?noPermission=true");
  }

  const [overview, metrics] = await Promise.all([
    getCampaignOverview.handle(adaptedRoute),
    isMonthlyType ? getPaymentMetrics.handle(adaptedRoute) : Promise.resolve(null),
  ]);

  return { campaign, overview, ...permissions, bannerTotalReceived: metrics?.released ?? null };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default CampaignLayout;
