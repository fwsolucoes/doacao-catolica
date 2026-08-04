import type { Route } from "+/route.campaign.collaborators";
import { redirect } from "react-router";
import { CollaboratorsPage } from "~/client/pages/collaborators";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { DecodeActionAdapter } from "~/infra/adapters/decodeAction";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listCollaborators } from "../factories/collaborators/listCollaboratorsFactory";
import { createInviteCollaborator } from "../factories/inviteCollaborator/createInviteCollaboratorFactory";
import { deleteInviteCollaborator } from "../factories/inviteCollaborator/deleteInviteCollaboratorFactory";
import { resendInviteCollaborator } from "../factories/inviteCollaborator/resendInviteCollaboratorFactory";
import { listInviteCollaborators } from "../factories/inviteCollaborator/listInviteCollaboratorsFactory";
import { updateInviteCollaborator } from "../factories/inviteCollaborator/updateInviteCollaboratorFactory";
import { listProjectRoles } from "../factories/projectRole/listProjectRolesFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [collaborators, inviteCollaborators, projectRoles] = await Promise.all([
    listCollaborators.handle(adaptedRoute),
    listInviteCollaborators.handle(adaptedRoute),
    listProjectRoles.handle(adaptedRoute),
  ]);

  return { collaborators, inviteCollaborators, projectRoles };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const _action = await DecodeActionAdapter.decode(adaptedRoute.request);

  try {
    switch (_action) {
      case "createInviteCollaborator":
        return await createInviteCollaborator.handle(adaptedRoute);
      case "updateInviteCollaborator":
        return await updateInviteCollaborator.handle(adaptedRoute);
      case "deleteInviteCollaborator":
        return await deleteInviteCollaborator.handle(adaptedRoute);
      case "resendInviteCollaborator":
        return await resendInviteCollaborator.handle(adaptedRoute);
      default:
        throw HttpAdapter.badRequest("Action not implemented");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function CollaboratorsRoute() {
  return <CollaboratorsPage />;
}
