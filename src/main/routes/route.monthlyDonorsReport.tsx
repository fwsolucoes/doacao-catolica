import type { Route } from "+/route.monthlyDonorsReport";
import { redirect } from "react-router";
import { MonthlyDonorsReportPage } from "~/client/pages/monthlyDonorsReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getMonthlyDonors } from "../factories/monthlyDonors/getMonthlyDonorsFactory";
import { listCampaignSelect } from "../factories/campaignSelect/listCampaignSelectFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const [monthlyDonors, campaigns] = await Promise.all([
    getMonthlyDonors.handle(adaptedRoute),
    listCampaignSelect.handle(adaptedRoute),
  ]);

  return { monthlyDonors, campaigns };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function MonthlyDonorsReportRoute() {
  return <MonthlyDonorsReportPage />;
}
