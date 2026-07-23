import type { Route } from "+/route.campaign.notifications";
import { redirect } from "react-router";
import { CampaignNotificationsPage } from "~/client/pages/campaignNotifications";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listSentNotifications } from "../factories/sentNotification/listSentNotificationsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const notifications = await listSentNotifications.handle(adaptedRoute);
  return { notifications };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CampaignNotificationsRoute() {
  return <CampaignNotificationsPage />;
}
