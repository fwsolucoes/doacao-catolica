import type { Route } from "+/route.dashboard";
import { redirect } from "react-router";
import { DashboardPage } from "~/client/pages/dashboardPage";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { getAnnualEvolution } from "../factories/annualEvolution/getAnnualEvolutionFactory";
import { getDashboardPaymentMethods } from "../factories/dashboardPaymentMethods/getDashboardPaymentMethodsFactory";
import { listCampaigns } from "../factories/campaing/listCampaingsFactory";
import { getPortalOverview } from "../factories/campaignOverview/getPortalOverviewFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const campaigns = await listCampaigns.handle(adaptedRoute);
  const firstCampaign = campaigns.data[0];

  if (!firstCampaign) {
    return {
      overview: null,
      annualEvolution: null,
      paymentMethods: null,
      currentMonth,
      currentYear,
    };
  }

  const accountUuid = String(
    firstCampaign.apiDonationPublicId ?? firstCampaign.id,
  );

  const [overview, annualEvolution, paymentMethods] = await Promise.all([
    getPortalOverview.handle(accountUuid),
    getAnnualEvolution.handle(accountUuid),
    getDashboardPaymentMethods.handle(accountUuid),
  ]);

  return { overview, annualEvolution, paymentMethods, currentMonth, currentYear };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function Dashboard() {
  return <DashboardPage />;
}
