import type { Route } from "+/route.campaign.campaignPage";
import { redirect } from "react-router";
import { CampaignPagePage } from "~/client/pages/campaignPage";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { getCampaignPreferences } from "../factories/campaign/getCampaignPreferencesFactory";
import { updateCampaignPage } from "../factories/campaign/updateCampaignPageFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");
  const [campaign, preferences] = await Promise.all([
    getCampaign.handle(route),
    getCampaignPreferences.handle(route),
  ]);
  return { campaign, preferences };
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const formData = await route.request.clone().formData();
  const _action = formData.get("_action");

  try {
    switch (_action) {
      case "updateCampaignPage":
        return await updateCampaignPage.handle(route);
      default:
        return HttpAdapter.badRequest("Ação não definida");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignPageRoute() {
  return <CampaignPagePage />;
}
