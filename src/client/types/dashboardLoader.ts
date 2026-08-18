import type { AnnualEvolutionData } from "~/domain/gateways/annualEvolution";
import type { CampaignOverviewData } from "~/domain/gateways/campaignOverview";

type DashboardLoader = {
  overview: CampaignOverviewData | null;
  annualEvolution: AnnualEvolutionData | null;
  currentMonth: number;
  currentYear: number;
};

export type { DashboardLoader };
