import type { CampaignOverviewByAccountSearchParams } from "~/app/search/campaignOverviewByAccountSearchParams";
import type { CampaignOverviewData } from "./campaignOverview";

type CampaignOverviewByAccountGatewayDTO = {
  getOverview(
    searchParams: CampaignOverviewByAccountSearchParams,
  ): Promise<CampaignOverviewData>;
};

export type { CampaignOverviewByAccountGatewayDTO };
