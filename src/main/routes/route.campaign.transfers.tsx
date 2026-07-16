import type { Route } from "+/route.campaign.transfers";
import { redirect } from "react-router";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { TransferPage } from "~/client/pages/transfer";
import { DecodeActionAdapter } from "~/infra/adapters/decodeAction";
import { ErrorHandlerAdapter } from "~/infra/adapters/errorHandlerAdapter";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { listSubAccounts } from "../factories/subAccount/listSubAccountsFactory";
import { getTransferMetrics } from "../factories/transfer/getTransferMetricsFactory";
import { listTransfers } from "../factories/transfer/listTransfersFactory";
import { createTransferAccount } from "../factories/transferAccount/createTransferAccountFactory";
import { listTransferAccounts } from "../factories/transferAccount/listTransferAccountsFactory";
import { requestWithdrawal } from "../factories/transferAccount/requestWithdrawalFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [transfers, transferMetrics, transferAccounts, subAccounts] =
    await Promise.all([
      listTransfers.handle(adaptedRoute),
      getTransferMetrics.handle(adaptedRoute),
      listTransferAccounts.handle(adaptedRoute),
      listSubAccounts.handle(adaptedRoute),
    ]);

  return { transfers, transferMetrics, transferAccounts, subAccounts };
}

export async function action(args: Route.ActionArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const _action = await DecodeActionAdapter.decode(adaptedRoute.request);

  try {
    switch (_action) {
      case "createTransferAccount":
        return await createTransferAccount.handle(adaptedRoute);
      case "requestWithdrawal":
        return await requestWithdrawal.handle(adaptedRoute);
      default:
        throw HttpAdapter.badRequest("Action not implemented");
    }
  } catch (error) {
    return ErrorHandlerAdapter.handle(error);
  }
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function TransfersRoute() {
  return <TransferPage />;
}
