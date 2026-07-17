import type { Route } from "./+types/route.campaign.home";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getCampaignOverview } from "~/main/factories/campaignOverview/getCampaignOverviewFactory";
import { getDonationEvolution } from "~/main/factories/donationEvolution/getDonationEvolutionFactory";
import { CampaignHomePage } from "~/client/pages/campaignHome";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);

  const [overview, evolution] = await Promise.all([
    getCampaignOverview.handle(route),
    getDonationEvolution.handle(route),
  ]);

  return { overview, evolution };
}

export default function CampaignHomeRoute() {
  return <CampaignHomePage />;
}
