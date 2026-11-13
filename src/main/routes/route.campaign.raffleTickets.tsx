import type { Route } from "+/route.campaign.raffleTickets";
import { redirect } from "react-router";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RaffleTicketsPage } from "~/client/pages/raffleTickets";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listRaffleTickets } from "../factories/raffle/listRaffleTicketsFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  return await listRaffleTickets.handle(adaptedRoute);
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function RaffleTicketsRoute() {
  return <RaffleTicketsPage />;
}
