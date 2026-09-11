import type { Route } from "+/api.whatsapp.selectOfficialNumber";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { createDefaultAccountWhatsappSettings } from "../factories/whatsapp/createDefaultAccountWhatsappSettingsFactory";

export async function action(args: Route.ActionArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(args);
    return await createDefaultAccountWhatsappSettings.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}
