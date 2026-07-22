import type { CampaignSearchParams } from "~/app/search/campaignSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import type { Campaign } from "../entities/campaign";

type UpdateCampaignGeneralInfoInput = {
  campaignId: string;
  subAccountId: string;
  name: string;
  slug: string;
  status: boolean;
  published: boolean;
  startDate: string | null;
  endDate: string | null;
  noEndDate: boolean;
  phone: string | null;
  typeDonation: string;
  totalGoal: number | null;
  monthlyGoal: number | null;
  institutionName: string | null;
  cnpj: string | null;
  address: string | null;
  email: string | null;
  type: number;
  description: string | null;
  image: string | null;
};

type UpdateCampaignPageInput = {
  campaignId: string;
  subAccountId: string;
  name: string;
  slug: string;
  status: boolean;
  published: boolean;
  startDate: string | null;
  endDate: string | null;
  noEndDate: boolean;
  phone: string | null;
  typeDonation: string;
  totalGoal: number | null;
  monthlyGoal: number | null;
  institutionName: string | null;
  cnpj: string | null;
  address: string | null;
  email: string | null;
  type: number;
  description: string | null;
  image: string | null;
  imageMobile: string | null;
  videoUrl: string | null;
  headerImage: string | null;
};

type CampaignGatewayDTO = {
  listCampaigns: (
    searchParams: CampaignSearchParams,
    token: string,
  ) => Promise<SearchResult<Campaign>>;
  getCampaign: (id: string, token: string) => Promise<Campaign>;
  verifySlug: (slug: string, token: string) => Promise<{ available: boolean }>;
  updateCampaignGeneralInfo: (
    input: UpdateCampaignGeneralInfoInput,
    token: string,
  ) => Promise<void>;
  updateCampaignPage: (
    input: UpdateCampaignPageInput,
    token: string,
  ) => Promise<void>;
};

export type { CampaignGatewayDTO, UpdateCampaignGeneralInfoInput, UpdateCampaignPageInput };
