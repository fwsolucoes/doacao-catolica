import type { Route } from "+/route.campaign.donorHealthReport";
import { redirect } from "react-router";
import { DonorHealthReportPage } from "~/client/pages/donorHealthReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { getDonorHealth } from "../factories/donorHealth/getDonorHealthFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaign = await getCampaign.handle(adaptedRoute);
  const donorHealth = await getDonorHealth.handle(adaptedRoute, {
    accountId: campaign.accountId,
  });

  return { campaignName: campaign.name, donorHealth };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function DonorHealthReportRoute() {
  return <DonorHealthReportPage />;
}
