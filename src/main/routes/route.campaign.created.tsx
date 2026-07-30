import type { Route } from "+/route.campaign.created";
import { redirect } from "react-router";
import { CampaignCreatedPage } from "~/client/pages/campaignCreated";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");
  const campaign = await getCampaign.handle(route);
  return { campaign };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignCreatedRoute() {
  return <CampaignCreatedPage />;
}
