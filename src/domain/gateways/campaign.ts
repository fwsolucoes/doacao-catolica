import type { CampaignSearchParams } from "~/app/search/campaignSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import type { Campaign } from "../entities/campaign";

type CreateCampaignInput = {
  accountId: number;
  name: string;
  slug: string;
  typeDonation: string;
  status: boolean;
  published: boolean;
  startDate: string | null;
  endDate: string | null;
  phone: string | null;
  cnpj: string | null;
  institutionName: string | null;
  image: string | null;
  address: string | null;
  featuredImage: string | null;
  imageMobile: string | null;
  headerImage: string | null;
  videoUrl: string | null;
  description: string | null;
  projectCategoryId: string | null;
  totalGoal: number | null;
  monthlyGoal: number | null;
  registrationTitle: string | null;
  whyDonateTitle: string | null;
  whyDonateText: string | null;
  whyDonateImage: string | null;
  aboutUsTitle: string | null;
  aboutUsText: string | null;
  aboutUsImage: string | null;
  supportWhatsapp: string | null;
  supportEmail: string | null;
  pixEnable: boolean;
  bankslipEnable: boolean;
  creditEnable: boolean;
  minAmount: number | null;
  showProgressBar: boolean;
  progressGoalType: string | null;
};

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

type GetProjectPermissionsOutput = {
  projectRole: { name: string };
  projectPermissions: string[];
};

type CampaignGatewayDTO = {
  listCampaigns: (
    searchParams: CampaignSearchParams,
    token: string,
  ) => Promise<SearchResult<Campaign>>;
  getCampaign: (id: string, token: string) => Promise<Campaign>;
  verifySlug: (slug: string, token: string) => Promise<{ available: boolean }>;
  createCampaign: (
    input: CreateCampaignInput,
    token: string,
  ) => Promise<{ id: string }>;
  updateCampaignGeneralInfo: (
    input: UpdateCampaignGeneralInfoInput,
    token: string,
  ) => Promise<void>;
  updateCampaignPage: (
    input: UpdateCampaignPageInput,
    token: string,
  ) => Promise<void>;
  getProjectPermissions: (
    projectId: string,
    userId: string,
    token: string,
  ) => Promise<GetProjectPermissionsOutput>;
};

export type {
  CampaignGatewayDTO,
  CreateCampaignInput,
  UpdateCampaignGeneralInfoInput,
  UpdateCampaignPageInput,
  GetProjectPermissionsOutput,
};
