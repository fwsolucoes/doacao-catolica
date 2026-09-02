import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { AuthService } from "~/infra/services/authService";
import { DecodeRequestBodyAdapter } from "~/infra/adapters/decodeRequestBodyAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { getWhatsappTemplate } from "../factories/whatsappTemplates/getWhatsappTemplateFactory";
import { updateWhatsappTemplate } from "../factories/whatsappTemplates/updateWhatsappTemplateFactory";
import { updateWhatsappTemplateVariable } from "../factories/whatsappTemplates/updateWhatsappTemplateVariableFactory";
import { createWhatsappTemplateVariable } from "../factories/whatsappTemplates/createWhatsappTemplateVariableFactory";
import { deleteWhatsappTemplateVariable } from "../factories/whatsappTemplates/deleteWhatsappTemplateVariableFactory";
import { createWhatsappTemplateButton } from "../factories/whatsappTemplates/createWhatsappTemplateButtonFactory";
import { updateWhatsappTemplateButton } from "../factories/whatsappTemplates/updateWhatsappTemplateButtonFactory";
import { deleteWhatsappTemplateButton } from "../factories/whatsappTemplates/deleteWhatsappTemplateButtonFactory";
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
    const peek = await DecodeRequestBodyAdapter.decode(route.request.clone());
    if (peek._action === "save_variable") {
      return await updateWhatsappTemplateVariable.handle(route);
    }
    if (peek._action === "add_variable") {
      return await createWhatsappTemplateVariable.handle(route);
    }
    if (peek._action === "delete_variable") {
      return await deleteWhatsappTemplateVariable.handle(route);
    }
    if (peek._action === "create_button") {
      return await createWhatsappTemplateButton.handle(route);
    }
    if (peek._action === "delete_button") {
      return await deleteWhatsappTemplateButton.handle(route);
    }
    if (peek._action === "save_button") {
      const buttonData = JSON.parse(peek.button ?? "null");
      if (buttonData?.uuid) return await updateWhatsappTemplateButton.handle(route);
    }
    return await updateWhatsappTemplate.handle(route);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export default function MetaTemplatesEditRoute() {
  return <EditMetaTemplatePage />;
}
