import type { Route } from "+/route.defaultersReport";
import { redirect } from "react-router";
import { DefaultersReportPage } from "~/client/pages/defaultersReport";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getDefaultingDonors } from "../factories/defaultingDonors/getDefaultingDonorsFactory";
import { listCampaignSelect } from "../factories/campaignSelect/listCampaignSelectFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);

  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const months = Number(adaptedRoute.query.months ?? 4);
  const accountUuid = adaptedRoute.query.account_uuid || undefined;

  const [defaultingDonors, campaigns] = await Promise.all([
    getDefaultingDonors.handle(accountUuid, months, String(user.accountId)),
    listCampaignSelect.handle(adaptedRoute),
  ]);

  return { defaultingDonors, months, campaigns };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function DefaultersReportRoute() {
  return <DefaultersReportPage />;
}
