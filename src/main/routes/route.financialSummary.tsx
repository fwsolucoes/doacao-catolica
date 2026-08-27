import type { Route } from "+/route.financialSummary";
import { redirect } from "react-router";
import { FinancialSummaryPage } from "~/client/pages/financialSummary";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { DecodeActionAdapter } from "~/infra/adapters/decodeAction";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getFinancialSummary } from "../factories/financialSummary/getFinancialSummaryFactory";
import { listTransferAccountsByUser } from "../factories/transferAccount/listTransferAccountsByUserFactory";
import { requestWithdrawal } from "../factories/transferAccount/requestWithdrawalFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [financialSummary, transferAccounts] = await Promise.all([
    getFinancialSummary.handle(adaptedRoute),
    listTransferAccountsByUser.handle(adaptedRoute),
  ]);

  return { financialSummary, transferAccounts };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const _action = await DecodeActionAdapter.decode(adaptedRoute.request);

  try {
    switch (_action) {
      case "requestWithdrawal":
        return await requestWithdrawal.handle(adaptedRoute);
      default:
        throw HttpAdapter.notImplemented("Action not implemented");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function FinancialSummaryRoute() {
  return <FinancialSummaryPage />;
}
