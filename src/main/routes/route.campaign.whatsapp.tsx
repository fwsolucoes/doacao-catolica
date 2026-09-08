import type { Route } from "+/route.campaign.whatsapp";
import { CampaignWhatsappPage } from "~/client/pages/campaignWhatsapp";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getAccountWhatsappSettings } from "../factories/whatsapp/getAccountWhatsappSettingsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  return await getAccountWhatsappSettings.handle(adaptedRoute);
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignWhatsappRoute() {
  return <CampaignWhatsappPage />;
}
