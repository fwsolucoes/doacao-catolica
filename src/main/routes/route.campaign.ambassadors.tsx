import type { Route } from "+/route.campaign.ambassadors";
import { redirect } from "react-router";
import { AmbassadorsPage } from "~/client/pages/ambassadors";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { DecodeActionAdapter } from "~/infra/adapters/decodeAction";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listActiveFundraisers } from "../factories/fundraiser/listActiveFundraisersFactory";
import { listFundraisers } from "../factories/fundraiser/listFundraisersFactory";
import { createFundraiser } from "../factories/fundraiser/createFundraiserFactory";
import { cancelInviteFundraiser } from "../factories/fundraiser/cancelInviteFundraiserFactory";
import { resendInviteFundraiser } from "../factories/fundraiser/resendInviteFundraiserFactory";
import { removeFundraiser } from "../factories/fundraiser/removeFundraiserFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [activeFundraisers, fundraisers] = await Promise.all([
    listActiveFundraisers.handle(adaptedRoute),
    listFundraisers.handle(adaptedRoute),
  ]);

  return { activeFundraisers, fundraisers };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const _action = await DecodeActionAdapter.decode(adaptedRoute.request);

  try {
    switch (_action) {
      case "createFundraiser":
        return await createFundraiser.handle(adaptedRoute);
      case "cancelInviteFundraiser":
        return await cancelInviteFundraiser.handle(adaptedRoute);
      case "resendInviteFundraiser":
        return await resendInviteFundraiser.handle(adaptedRoute);
      case "removeFundraiser":
        return await removeFundraiser.handle(adaptedRoute);
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

export default function AmbassadorsRoute() {
  return <AmbassadorsPage />;
}
