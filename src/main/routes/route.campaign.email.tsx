import type { Route } from "+/route.campaign.email";
import { redirect } from "react-router";
import { CampaignEmailPage } from "~/client/pages/campaignEmail";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { createEmailTemplate } from "../factories/campaign/createEmailTemplateFactory";
import { deleteEmailTemplate } from "../factories/campaign/deleteEmailTemplateFactory";
import { getCampaignPreferences } from "../factories/campaign/getCampaignPreferencesFactory";
import { listEmailTemplates } from "../factories/campaign/listEmailTemplatesFactory";
import { updateCampaignEmailSettings } from "../factories/campaign/updateCampaignEmailSettingsFactory";
import { updateEmailTemplate } from "../factories/campaign/updateEmailTemplateFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");
  const [preferences, emailLayouts] = await Promise.all([
    getCampaignPreferences.handle(route),
    listEmailTemplates.handle(route),
  ]);
  return { preferences, emailLayouts };
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const formData = await route.request.clone().formData();
  const _action = formData.get("_action");

  try {
    switch (_action) {
      case "updateEmailSettings":
        return await updateCampaignEmailSettings.handle(route);
      case "createEmailTemplate":
        return await createEmailTemplate.handle(route);
      case "updateEmailTemplate":
        return await updateEmailTemplate.handle(route);
      case "deleteEmailTemplate":
        return await deleteEmailTemplate.handle(route);
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

export default function CampaignEmailRoute() {
  return <CampaignEmailPage />;
}
