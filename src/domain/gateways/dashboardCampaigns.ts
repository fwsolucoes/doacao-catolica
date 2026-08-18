import type { DashboardCampaignsSearchParams } from "~/app/search/dashboardCampaignsSearchParams";

type DashboardCampaign = {
  accountReference: string;
  name: string;
  donorsCount: number;
  monthRaised: number;
  totalRaised: number;
  monthlyGoal: number | null;
  totalGoal: number | null;
  progressPercentage: number | null;
};

type DashboardCampaignsData = {
  total: number;
  campaigns: DashboardCampaign[];
};

type DashboardCampaignsGatewayDTO = {
  getCampaigns(
    accountUuid: string,
    searchParams: DashboardCampaignsSearchParams,
  ): Promise<DashboardCampaignsData>;
};

export type {
  DashboardCampaignsGatewayDTO,
  DashboardCampaignsData,
  DashboardCampaign,
};
