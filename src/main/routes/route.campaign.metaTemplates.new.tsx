import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { AuthService } from "~/infra/services/authService";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { createWhatsappTemplate } from "../factories/whatsappTemplates/createWhatsappTemplateFactory";
import { NewMetaTemplatePage } from "~/client/pages/metaTemplates/new";

export async function loader(args: LoaderFunctionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");
  return {};
}

export async function action(args: ActionFunctionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  try {
    return await createWhatsappTemplate.handle(route);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export default function MetaTemplatesNewRoute() {
  return <NewMetaTemplatePage />;
}
