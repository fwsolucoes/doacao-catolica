import type { Route } from "+/route.campaign.paymentMethods";
import { redirect } from "react-router";
import { PaymentMethodsPage } from "~/client/pages/paymentMethods";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { paymentMethodFactory } from "../factories/paymentMethod/paymentMethodFactory";

export async function loader(args: Route.LoaderArgs) {
  const route = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(route);
  if (!user) throw redirect("/sign-in");

  return paymentMethodFactory.handleLoader(route);
}

export async function action(args: Route.ActionArgs) {
  const route = await RouteAdapter.adaptRoute(args);

  try {
    return await paymentMethodFactory.handleAction(route);
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function PaymentMethodsRoute() {
  return <PaymentMethodsPage />;
}
