import type { Route } from "+/route.campaign.donations";
import { redirect } from "react-router";
import { DonationsPage } from "~/client/pages/paymentStatements";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getPaymentMetrics, listPayments } from "../factories/paymentMetrics/getPaymentMetricsFactory";
import { listDonorsByCampaign } from "../factories/donor/listDonorsByCampaignFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [metrics, payments, donors] = await Promise.all([
    getPaymentMetrics.handle(adaptedRoute),
    listPayments.handle(adaptedRoute),
    listDonorsByCampaign.handle(adaptedRoute),
  ]);

  return { metrics, payments, donors };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function DonationsRoute() {
  return <DonationsPage />;
}
