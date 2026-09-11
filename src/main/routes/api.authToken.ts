import type { Route } from "+/api.authToken";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { authTokenUser } from "../factories/auth/authTokenUserFactory";

export async function loader(props: Route.LoaderArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await authTokenUser.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}
