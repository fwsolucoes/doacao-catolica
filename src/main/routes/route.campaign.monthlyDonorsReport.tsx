import type { Route } from "+/route.campaign.monthlyDonorsReport";
import { MonthlyDonorsReportPage } from "~/client/pages/monthlyDonorsReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { getMonthlyDonors } from "../factories/monthlyDonors/getMonthlyDonorsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const campaign = await getCampaign.handle(adaptedRoute);
  const projectId = String(campaign.apiDonationPublicId ?? campaign.id);

  const monthlyDonors = await getMonthlyDonors.handle(adaptedRoute, { projectId });

  return { monthlyDonors };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function MonthlyDonorsReportRoute() {
  return <MonthlyDonorsReportPage />;
}
