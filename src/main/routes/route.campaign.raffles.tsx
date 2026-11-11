import type { Route } from "+/route.campaign.raffles";
import { redirect } from "react-router";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RafflesPage } from "~/client/pages/raffles";
import { DecodeActionAdapter } from "~/infra/adapters/decodeAction";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { createRaffle } from "../factories/raffle/createRaffleFactory";
import { listRaffles } from "../factories/raffle/listRafflesFactory";
import { updateRaffle } from "../factories/raffle/updateRaffleFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const raffles = await listRaffles.handle(adaptedRoute);
  return { raffles };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const _action = await DecodeActionAdapter.decode(adaptedRoute.request);

  try {
    switch (_action) {
      case "createRaffle":
        return await createRaffle.handle(adaptedRoute);
      case "updateRaffle":
        return await updateRaffle.handle(adaptedRoute);
      default:
        throw HttpAdapter.badRequest("Action not implemented");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function RafflesRoute() {
  return <RafflesPage />;
}
