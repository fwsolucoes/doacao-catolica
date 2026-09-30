import type { Route } from "+/route.campaign.integrations";
import { redirect } from "react-router";
import { CampaignIntegrationsPage } from "~/client/pages/campaignIntegrations";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaignIntegrations } from "../factories/campaign/getCampaignIntegrationsFactory";
import { updateCampaignIntegrations } from "../factories/campaign/updateCampaignIntegrationsFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");
  const integrations = await getCampaignIntegrations.handle(route);
  return { integrations };
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const formData = await route.request.clone().formData();
  const _action = formData.get("_action");

  try {
    switch (_action) {
      case "updateIntegrations":
        return await updateCampaignIntegrations.handle(route);
      default:
        return HttpAdapter.badRequest("Ação não definida");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignIntegrationsRoute() {
  return <CampaignIntegrationsPage />;
}
