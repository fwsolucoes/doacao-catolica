import type { Route } from "./+types/route.campaign.home";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getCampaignActivity } from "~/main/factories/campaignActivity/getCampaignActivityFactory";
import { getCampaignBreakdowns } from "~/main/factories/campaignBreakdowns/getCampaignBreakdownsFactory";
import { getCampaignOverview } from "~/main/factories/campaignOverview/getCampaignOverviewFactory";
import { getDonationEvolution } from "~/main/factories/donationEvolution/getDonationEvolutionFactory";
import { getCampaignRecurrence } from "~/main/factories/campaignRecurrence/getCampaignRecurrenceFactory";
import { CampaignHomePage } from "~/client/pages/campaignHome";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);

  const [overview, evolution, activity, breakdowns, recurrence] = await Promise.all([
    getCampaignOverview.handle(route),
    getDonationEvolution.handle(route),
    getCampaignActivity.handle(route),
    getCampaignBreakdowns.handle(route),
    getCampaignRecurrence.handle(route),
  ]);

  return { overview, evolution, activity, breakdowns, recurrence };
}

export default function CampaignHomeRoute() {
  return <CampaignHomePage />;
}
