import type { Route } from "+/api.whatsapp.testConnection";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { testWhatsappConnection } from "../factories/whatsapp/testWhatsappConnectionFactory";

export async function action(args: Route.ActionArgs) {
  try {
    const adaptedRoute = await RouteAdapter.adaptRoute(args);
    return await testWhatsappConnection.handle(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}
