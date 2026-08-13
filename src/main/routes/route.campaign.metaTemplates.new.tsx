import { redirect, type LoaderFunctionArgs } from "react-router";
import { AuthService } from "~/infra/services/authService";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { NewMetaTemplatePage } from "~/client/pages/metaTemplates/new";

export async function loader(args: LoaderFunctionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");
  return {};
}

export default function MetaTemplatesNewRoute() {
  return <NewMetaTemplatePage />;
}
