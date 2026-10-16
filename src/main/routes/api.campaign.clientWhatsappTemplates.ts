import type { Route } from "+/api.campaign.clientWhatsappTemplates";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { listClientWhatsappTemplates } from "../factories/whatsappTemplates/listClientWhatsappTemplatesFactory";

export async function loader(props: Route.LoaderArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(props);
    return await listClientWhatsappTemplates.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}
