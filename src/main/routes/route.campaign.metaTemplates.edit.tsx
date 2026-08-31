import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { AuthService } from "~/infra/services/authService";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { getWhatsappTemplate } from "../factories/whatsappTemplates/getWhatsappTemplateFactory";
import { updateWhatsappTemplate } from "../factories/whatsappTemplates/updateWhatsappTemplateFactory";
import { EditMetaTemplatePage } from "~/client/pages/metaTemplates/edit";

export async function loader(args: LoaderFunctionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");
  const template = await getWhatsappTemplate.handle(adaptedRoute);
  return { template };
}

export async function action(args: ActionFunctionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  try {
    return await updateWhatsappTemplate.handle(route);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export default function MetaTemplatesEditRoute() {
  return <EditMetaTemplatePage />;
}
