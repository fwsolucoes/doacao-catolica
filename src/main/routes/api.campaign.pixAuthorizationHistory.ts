import type { Route } from "+/api.campaign.pixAuthorizationHistory";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { getPixAuthorizationHistory } from "../factories/pixAuthorizationHistory/getPixAuthorizationHistoryFactory";

export async function loader(props: Route.LoaderArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await getPixAuthorizationHistory.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}
