import type { Route } from "+/route.myCampaigns";
import { MyCampaignsPage } from "~/client/pages/myCampaigns";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listCampaigns } from "../factories/campaing/listCampaingsFactory";
import { listPendingInvites } from "../factories/pendingInvite/listPendingInvitesFactory";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { redirect } from "react-router";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const campaigns = await listCampaigns.handle(adaptedRoute);

  const url = new URL(args.request.url);
  const skipPendingInvites =
    url.searchParams.get("skipPendingInvites") === "true";

  if (!skipPendingInvites) {
    const pendingInvites =
      await listPendingInvites.handle(adaptedRoute);

    if (pendingInvites.items.length > 0) {
      throw redirect("/pending-invites");
    }
  }

  return { campaigns };
}

// export async function action(args: Route.ActionArgs) {
//   const adaptedRoute = await RouteAdapter.adaptRoute(args);
//   const _action = await DecodeActionAdapter.decode(adaptedRoute.request);

//   try {
//     switch (_action) {
//       case "deletePatient":
//         return await deletePatient.handle(adaptedRoute);
//       default:
//         throw HttpAdapter.notImplemented("Action not implemented");
//     }
//   } catch (error) {
//     return ErrorHandlerAdapter.handleAsData(error);
//   }
// }

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function TestPage() {
  return <MyCampaignsPage />;
}
