import type { Route } from "+/route.pendingInvites";
import { redirect } from "react-router";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { PendingInvitesPage } from "~/client/pages/pendingInvites";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getFormAction } from "~/lib/getFormAction";
import { acceptInvitation } from "../factories/pendingInvite/acceptInvitationFactory";
import { declineInvitation } from "../factories/pendingInvite/declineInvitationFactory";
import { listPendingInvites } from "../factories/pendingInvite/listPendingInvitesFactory";

const ACCEPT_ACTION = "acceptInvitation";
const DECLINE_ACTION = "declineInvitation";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const pendingInvites =
    await listPendingInvites.handle(adaptedRoute);

  return {
    pendingInvites,
    userEmail: user.email,
  };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  try {
    const { _action } = await getFormAction(adaptedRoute.request);

    switch (_action) {
      case ACCEPT_ACTION:
        return await acceptInvitation.handle(adaptedRoute);
      case DECLINE_ACTION:
        return await declineInvitation.handle(adaptedRoute);
      default:
        throw HttpAdapter.badRequest("Ação não definida");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function PendingInvitesRoute() {
  return <PendingInvitesPage />;
}
