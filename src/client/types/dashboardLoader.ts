import type { AnnualEvolutionData } from "~/domain/gateways/annualEvolution";
import type { DashboardCampaignsData } from "~/domain/gateways/dashboardCampaigns";
import type { DashboardPaymentMethodsData } from "~/domain/gateways/dashboardPaymentMethods";
import type { DashboardWeeklyData } from "~/domain/gateways/dashboardWeekly";
import type { CampaignOverviewData } from "~/domain/gateways/campaignOverview";

type DashboardLoader = {
  overview: CampaignOverviewData | null;
  annualEvolution: AnnualEvolutionData | null;
  paymentMethods: DashboardPaymentMethodsData | null;
  weekly: DashboardWeeklyData | null;
  featuredCampaigns: DashboardCampaignsData | null;
  currentMonth: number;
  currentYear: number;
};

export type { DashboardLoader };
