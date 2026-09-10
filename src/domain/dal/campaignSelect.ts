import type { CampaignSelect } from "../views/campaignSelect";

type CampaignSelectDalDTO = {
  listAll: (token: string) => Promise<CampaignSelect[]>;
};

export type { CampaignSelectDalDTO };
