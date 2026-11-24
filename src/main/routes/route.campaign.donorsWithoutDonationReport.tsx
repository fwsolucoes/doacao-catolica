import type { Route } from "+/route.campaign.donorsWithoutDonationReport";
import { DonorsWithoutDonationReportPage } from "~/client/pages/donorsWithoutDonationReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { getRegistrationsWithoutDonations } from "../factories/registrationsWithoutDonations/getRegistrationsWithoutDonationsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const campaign = await getCampaign.handle(adaptedRoute);
  const accountUuid = String(campaign.apiDonationPublicId ?? campaign.id);

  const registrationsWithoutDonations = await getRegistrationsWithoutDonations.handle(
    adaptedRoute,
    { accountUuid },
  );

  return { registrationsWithoutDonations };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function DonorsWithoutDonationReportRoute() {
  return <DonorsWithoutDonationReportPage />;
}
