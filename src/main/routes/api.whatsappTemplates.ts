import type { Route } from "+/api.whatsappTemplates";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { listWhatsappTemplates } from "../factories/whatsappTemplates/listWhatsappTemplatesFactory";

export async function loader(props: Route.LoaderArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await listWhatsappTemplates.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}
