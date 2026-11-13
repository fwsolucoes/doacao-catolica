import type { Route } from "+/route.campaign.donations";
import { redirect } from "react-router";
import { DonationsPage } from "~/client/pages/paymentStatements";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getPaymentMetrics, listPayments } from "../factories/paymentMetrics/getPaymentMetricsFactory";
import { listDonorsByCampaign } from "../factories/donor/listDonorsByCampaignFactory";
import { getDonationsSummary } from "../factories/donationsSummary/getDonationsSummaryFactory";
import { paymentFactory } from "../factories/payment/paymentFactory";
import { paymentMethodFactory } from "../factories/paymentMethod/paymentMethodFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [metrics, payments, donors, summary, { paymentMethods }] = await Promise.all([
    getPaymentMetrics.handle(adaptedRoute),
    listPayments.handle(adaptedRoute),
    listDonorsByCampaign.handle(adaptedRoute),
    getDonationsSummary.handle(adaptedRoute),
    paymentMethodFactory.handleLoader(adaptedRoute),
  ]);

  return { metrics, payments, donors, summary, paymentMethods, campaigns: [] as Array<{ id: string; name: string }> };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  try {
    return await paymentFactory.handleAction(adaptedRoute);
  } catch (error) {
    return ErrorHandlerAdapter.handleAsData(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function DonationsRoute() {
  return <DonationsPage />;
}
