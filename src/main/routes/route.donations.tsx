import type { Route } from "+/route.donations";
import { redirect } from "react-router";
import { DonationsPage } from "~/client/pages/paymentStatements";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { allDonationsMock } from "~/lib/mocks/allDonationsMock";
import { listPaymentsByAccount } from "../factories/paymentsByAccount/listPaymentsByAccountFactory";
import { getTotalPaymentsByAccount } from "../factories/totalPaymentsByAccount/getTotalPaymentsByAccountFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [metrics, payments] = await Promise.all([
    getTotalPaymentsByAccount.handle(user.accountId),
    listPaymentsByAccount.handle(user.accountId, adaptedRoute.query),
  ]);

  return { ...allDonationsMock, metrics, payments };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function AllDonationsRoute() {
  return <DonationsPage />;
}
