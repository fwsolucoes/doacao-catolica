import type { Route } from "+/route.campaign.defaultersReport";
import { DefaultersReportPage } from "~/client/pages/defaultersReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { getDefaultingDonors } from "../factories/defaultingDonors/getDefaultingDonorsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const campaign = await getCampaign.handle(adaptedRoute);
  const accountUuid = String(campaign.apiDonationPublicId ?? campaign.id);
  const months = Number(adaptedRoute.query.months ?? 4);

  const defaultingDonors = await getDefaultingDonors.handle(
    accountUuid,
    months,
  );

  return { defaultingDonors, months };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function DefaultersReportRoute() {
  return <DefaultersReportPage />;
}
