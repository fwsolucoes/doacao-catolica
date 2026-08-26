import type { Route } from "+/route.campaign.paymentMethods";
import { redirect } from "react-router";
import { CampaignPaymentSettingsPage } from "~/client/pages/campaignPaymentSettings";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getCampaignPreferences } from "../factories/campaign/getCampaignPreferencesFactory";
import { updateCampaignPaymentSettings } from "../factories/campaign/updateCampaignPaymentSettingsFactory";
import { listSubAccounts } from "../factories/subAccount/listSubAccountsFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");
  const [preferences, subAccounts] = await Promise.all([
    getCampaignPreferences.handle(route),
    listSubAccounts.handle(route),
  ]);
  return { preferences, subAccounts };
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const formData = await route.request.clone().formData();
  const _action = formData.get("_action");

  try {
    switch (_action) {
      case "updatePaymentSettings":
        return await updateCampaignPaymentSettings.handle(route);
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

export default function CampaignPaymentSettingsRoute() {
  return <CampaignPaymentSettingsPage />;
}
