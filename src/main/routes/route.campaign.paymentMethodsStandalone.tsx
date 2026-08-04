import { PaymentMethodsPage } from "~/client/pages/paymentMethods";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { paymentMethodFactory } from "~/main/factories/paymentMethod/paymentMethodFactory";
import type { Route } from "./+types/route.campaign.paymentMethodsStandalone";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  return paymentMethodFactory.handleLoader(adaptedRoute);
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  return paymentMethodFactory.handleAction(adaptedRoute);
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function PaymentMethodsRoute() {
  return <PaymentMethodsPage />;
}
