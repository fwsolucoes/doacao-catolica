import type { Route } from "+/api.whatsapp.createAccountSettings";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { createAccountWhatsappSettings } from "../factories/whatsapp/createAccountWhatsappSettingsFactory";

export async function action(args: Route.ActionArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(args);
    return await createAccountWhatsappSettings.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}
