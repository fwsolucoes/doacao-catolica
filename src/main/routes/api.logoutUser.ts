import type { Route } from "+/api.logoutUser";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthMiddleware } from "../middlewares/authMiddleware";

export async function action(props: Route.ActionArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await AuthMiddleware.logoutUser(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}
