import type { Route } from "+/route.campaignsGroups";
import { CampaignGroupsPage } from "~/client/pages/campaignGroups/index";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { campaignGroupFactory } from "../factories/campaignGroup/campaignGroupFactory";

export async function loader(_args: Route.LoaderArgs) {
  return await campaignGroupFactory.handleLoader();
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);

  try {
    return await campaignGroupFactory.handleAction(route);
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignGroupsRoute() {
  return <CampaignGroupsPage />;
}
