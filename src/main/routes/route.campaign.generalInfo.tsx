import type { Route } from "+/route.campaign.generalInfo";
import { redirect } from "react-router";
import { CampaignGeneralInfoPage } from "~/client/pages/campaignGeneralInfo";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
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

  if (_action === "verifySlug") {
    return await verifySlug.handle(route);
  }

  if (_action === "updateGeneralInfo") {
    return await updateCampaignGeneralInfo.handle(route);
  }

  return null;
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignGeneralInfoRoute() {
  return <CampaignGeneralInfoPage />;
}
