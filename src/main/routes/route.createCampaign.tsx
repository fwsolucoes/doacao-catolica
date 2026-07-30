import type { Route } from "+/route.createCampaign";
import { redirect } from "react-router";
import { CreateCampaignPage } from "~/client/pages/createCampaign";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { createCampaign } from "../factories/campaign/createCampaignFactory";
import { verifySlug } from "../factories/campaign/verifySlugFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");
  return null;
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);
  const formData = await route.request.clone().formData();
  const _action = formData.get("_action");

  try {
    switch (_action) {
      case "verifySlug":
        return await verifySlug.handle(route);
      case "createCampaign": {
        const { campaignId } = await createCampaign.handle(route);
        return redirect(`/campaign/${campaignId}/home`);
      }
      default:
        return HttpAdapter.badRequest("Ação não definida");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CreateCampaignRoute() {
  return <CreateCampaignPage />;
}
