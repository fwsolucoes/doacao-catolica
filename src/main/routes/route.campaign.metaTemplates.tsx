import { redirect, type LoaderFunctionArgs } from "react-router";
import { AuthService } from "~/infra/services/authService";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { listWhatsappTemplates } from "../factories/whatsappTemplates/listWhatsappTemplatesFactory";
import { MetaTemplatesPage } from "~/client/pages/metaTemplates";

export async function loader(args: LoaderFunctionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");
  const templates = await listWhatsappTemplates.handle(adaptedRoute);
  return { templates };
}

export default function MetaTemplatesRoute() {
  return <MetaTemplatesPage />;
}
