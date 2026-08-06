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

// Shared input for PUT /project/update-with-details/:id.
// Expanded incrementally as each settings menu is migrated to this endpoint.
type UpdateCampaignWithDetailsInput = {
  campaignId: string;
  // Informações Gerais
  name?: string | null;
  slug?: string | null;
  status?: boolean;
  visibleInMarketplace?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  noEndDate?: boolean;
  phone?: string | null;
  typeDonation?: string | null;
  totalGoal?: number | null;
  monthlyGoal?: number | null;
  institutionName?: string | null;
  cnpj?: string | null;
  address?: string | null;
  // Página da Campanha — top-level
  image?: string | null;
  imageMobile?: string | null;
  videoUrl?: string | null;
  headerImage?: string | null;
  // Página da Campanha — preferences
  title?: string | null;
  description?: string | null;
  whyDonateTitle?: string | null;
  whyDonateText?: string | null;
  whyDonateImage?: string | null;
  aboutTitle?: string | null;
  aboutText?: string | null;
  aboutImage?: string | null;
  supportWhatsapp?: string | null;
  supportEmail?: string | null;
  // Valores e Pagamento — preferences
  pixEnabled?: boolean;
  boletoEnabled?: boolean;
  creditCardEnabled?: boolean;
  minAmount?: number | null;
  passFeeToDonor?: boolean;
  allowCustomAmount?: boolean;
  chargeImmediately?: boolean;
  // Email — preferences
  emailSenderName?: string | null;
  emailReplyTo?: string | null;
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
  updateCampaignWithDetails: (
    input: UpdateCampaignWithDetailsInput,
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
  UpdateCampaignWithDetailsInput,
  GetProjectPermissionsOutput,
};
