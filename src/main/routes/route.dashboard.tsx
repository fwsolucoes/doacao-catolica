import type { Route } from "+/route.dashboard";
import { redirect } from "react-router";
import { DashboardPage } from "~/client/pages/dashboardPage";
import { ErrorBoundaryPage } from "~/client/pages/errorBoundary";
import { RouteAdapter } from "~/infra/adapters/routeAdapter";
import { AuthService } from "~/infra/services/authService";
import { resolveGeneralReportsAccountId } from "~/lib/generalReportsAccountId.server";
import { getAnnualEvolution } from "../factories/annualEvolution/getAnnualEvolutionFactory";
import { getDashboardCampaigns } from "../factories/dashboardCampaigns/getDashboardCampaignsFactory";
import { getDashboardPaymentMethods } from "../factories/dashboardPaymentMethods/getDashboardPaymentMethodsFactory";
import { getDashboardRecentDonations } from "../factories/dashboardRecentDonations/getDashboardRecentDonationsFactory";
import { getDashboardWeekly } from "../factories/dashboardWeekly/getDashboardWeeklyFactory";
import { listCampaigns } from "../factories/campaign/listCampaignsFactory";
import { getPortalOverviewByAccount } from "../factories/campaignOverview/getPortalOverviewByAccountFactory";

export async function loader(args: Route.LoaderArgs) {
  const adaptedRoute = await RouteAdapter.adaptRoute(args);
  const user = await AuthService.getAuthStorage(adaptedRoute);
  if (!user) throw redirect("/sign-in");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const accountId = resolveGeneralReportsAccountId(user);

  const [campaigns, overview] = await Promise.all([
    listCampaigns.handle(adaptedRoute),
    getPortalOverviewByAccount.handle(accountId),
  ]);
  const firstCampaign = campaigns.data[0];

  if (!firstCampaign) {
    return {
      overview,
      annualEvolution: null,
      paymentMethods: null,
      weekly: null,
      featuredCampaigns: null,
      recentDonations: null,
      currentMonth,
      currentYear,
    };
  }

  const accountUuid = String(
    firstCampaign.apiDonationPublicId ?? firstCampaign.id,
  );

  const [annualEvolution, paymentMethods, weekly, featuredCampaigns, recentDonations] =
    await Promise.all([
      getAnnualEvolution.handle(accountUuid),
      getDashboardPaymentMethods.handle(accountUuid),
      getDashboardWeekly.handle(accountUuid),
      getDashboardCampaigns.handle(accountUuid),
      getDashboardRecentDonations.handle(accountUuid),
    ]);

  return {
    overview,
    annualEvolution,
    paymentMethods,
    weekly,
    featuredCampaigns,
    recentDonations,
    currentMonth,
    currentYear,
  };
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />;
}

export default function Dashboard() {
  return <DashboardPage />;
}
