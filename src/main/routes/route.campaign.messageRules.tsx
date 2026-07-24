import { redirect } from "react-router";
import type { Route } from "+/route.campaign.messageRules";
import { MessageRulesPage } from "~/client/pages/messageRules";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { DecodeActionAdapter } from "~/infra/adapters/decodeAction";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { createNotificationSetting } from "../factories/notificationSetting/createNotificationSettingFactory";
import { listNotificationSettings } from "../factories/notificationSetting/listNotificationSettingsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const notificationSettings = await listNotificationSettings.handle(adaptedRoute);
  return { notificationSettings };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const _action = await DecodeActionAdapter.decode(adaptedRoute.request);

  try {
    switch (_action) {
      case "createNotificationSetting":
        return await createNotificationSetting.handle(adaptedRoute);
      default:
        throw HttpAdapter.badRequest("Action not implemented");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function MessageRulesRoute() {
  return <MessageRulesPage />;
}
