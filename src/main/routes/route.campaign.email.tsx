import type { Route } from "+/route.campaign.email";
import { redirect } from "react-router";
import { CampaignEmailPage } from "~/client/pages/campaignEmail";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaignPreferences } from "../factories/campaign/getCampaignPreferencesFactory";
import { updateCampaignEmailSettings } from "../factories/campaign/updateCampaignEmailSettingsFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");
  const preferences = await getCampaignPreferences.handle(route);
  return { preferences };
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const formData = await route.request.clone().formData();
  const _action = formData.get("_action");

  try {
    switch (_action) {
      case "updateEmailSettings":
        return await updateCampaignEmailSettings.handle(route);
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

export default function CampaignEmailRoute() {
  return <CampaignEmailPage />;
}
