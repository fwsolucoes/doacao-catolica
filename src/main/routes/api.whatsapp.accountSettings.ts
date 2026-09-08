import type { Route } from "+/api.whatsapp.accountSettings";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { updateAccountWhatsappSettings } from "../factories/whatsapp/updateAccountWhatsappSettingsFactory";

export async function action(args: Route.ActionArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(args);
    return await updateAccountWhatsappSettings.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}
