import type { AnnualEvolutionData } from "~/domain/gateways/annualEvolution";
import type { DashboardPaymentMethodsData } from "~/domain/gateways/dashboardPaymentMethods";
import type { CampaignOverviewData } from "~/domain/gateways/campaignOverview";

type DashboardLoader = {
  overview: CampaignOverviewData | null;
  annualEvolution: AnnualEvolutionData | null;
  paymentMethods: DashboardPaymentMethodsData | null;
  currentMonth: number;
  currentYear: number;
};

export type { DashboardLoader };
