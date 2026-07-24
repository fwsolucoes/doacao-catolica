import { redirect } from "react-router";
import type { Route } from "+/route.campaign.messageRules";
import { MessageRulesPage } from "~/client/pages/messageRules";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listNotificationSettings } from "../factories/notificationSetting/listNotificationSettingsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const notificationSettings = await listNotificationSettings.handle(adaptedRoute);
  return { notificationSettings };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function MessageRulesRoute() {
  return <MessageRulesPage />;
}
