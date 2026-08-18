import type { CampaignOverviewData } from "~/domain/gateways/campaignOverview";

type DashboardLoader = {
  overview: CampaignOverviewData | null;
};

export type { DashboardLoader };
