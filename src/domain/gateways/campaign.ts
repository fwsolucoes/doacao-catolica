import type { CampaignSearchParams } from "~/app/search/campaignSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import type { Campaign } from "../entities/campaign";

type CampaignGatewayDTO = {
  listCampaigns: (
    searchParams: CampaignSearchParams,
    token: string,
  ) => Promise<SearchResult<Campaign>>;
  getCampaign: (id: string, token: string) => Promise<Campaign>;
  verifySlug: (slug: string, token: string) => Promise<{ available: boolean }>;
};

export type { CampaignGatewayDTO };
