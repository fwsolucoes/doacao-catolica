import type { Route } from "+/route.donations";
import { redirect } from "react-router";
import { DonationsPage } from "~/client/pages/paymentStatements";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { allDonationsMock } from "~/lib/mocks/allDonationsMock";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  // TODO: mock — trocar por chamada real ao endpoint de doações de todas as
  // campanhas (loader → controller → gateway, sem campaignId). Ver allDonationsMock.
  return allDonationsMock;
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function AllDonationsRoute() {
  return <DonationsPage />;
}
