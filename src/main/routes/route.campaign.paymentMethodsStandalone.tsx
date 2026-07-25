import { PaymentMethodsPage } from "~/client/pages/paymentMethods";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { paymentMethodFactory } from "~/main/factories/paymentMethod/paymentMethodFactory";
import type { Route } from "./+types/route.campaign.paymentMethodsStandalone";

export async function loader(args: Route.LoaderArgs) {
  return paymentMethodFactory.handleLoader(args);
}

export async function action(args: Route.ActionArgs) {
  return paymentMethodFactory.handleAction(args);
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function PaymentMethodsRoute() {
  return <PaymentMethodsPage />;
}
