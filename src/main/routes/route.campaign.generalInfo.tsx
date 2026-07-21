import type { Route } from "+/route.campaign.generalInfo";
import { redirect } from "react-router";
import { CampaignGeneralInfoPage } from "~/client/pages/campaignGeneralInfo";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaign } from "../factories/campaign/getCampaignFactory";
import { updateCampaignGeneralInfo } from "../factories/campaign/updateCampaignGeneralInfoFactory";
import { verifySlug } from "../factories/campaign/verifySlugFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");
  const campaign = await getCampaign.handle(route);
  return { campaign };
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const formData = await route.request.clone().formData();
  const _action = formData.get("_action");

  try {
    switch (_action) {
      case "verifySlug":
        return await verifySlug.handle(route);
      case "updateGeneralInfo":
        return await updateCampaignGeneralInfo.handle(route);
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

export default function CampaignGeneralInfoRoute() {
  return <CampaignGeneralInfoPage />;
}
