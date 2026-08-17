import type { Route } from "+/api.campaign.paymentNotifications";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { listPaymentNotifications } from "../factories/paymentNotification/listPaymentNotificationsFactory";

export async function loader(props: Route.LoaderArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await listPaymentNotifications.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}
