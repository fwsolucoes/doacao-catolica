import type { Route } from "+/route.financialSummary";
import { redirect } from "react-router";
import { FinancialSummaryPage } from "~/client/pages/financialSummary";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getFinancialSummary } from "../factories/financialSummary/getFinancialSummaryFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const financialSummary = await getFinancialSummary.handle(adaptedRoute);

  return { financialSummary };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function FinancialSummaryRoute() {
  return <FinancialSummaryPage />;
}
