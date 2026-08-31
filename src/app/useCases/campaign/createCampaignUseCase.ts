import type { AccountWhatsappSettingsGatewayDTO } from "~/domain/gateways/accountWhatsappSettings";
import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";
import { environmentVariables } from "~/main/config/environmentVariables";

type InputProps = {
  token: string;
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
  institutionCep: string | null;
  institutionStreet: string | null;
  institutionNumber: string | null;
  institutionComplement: string | null;
  institutionNeighborhood: string | null;
  institutionCity: string | null;
  institutionState: string | null;
  featuredImage: string | null;
  imageMobile: string | null;
  headerImage: string | null;
  videoUrl: string | null;
  description: string | null;
  category: string | null;
  title: string | null;
  whyDonateTitle: string | null;
  whyDonateText: string | null;
  whyDonateImage: string | null;
  aboutTitle: string | null;
  aboutText: string | null;
  aboutImage: string | null;
  supportWhatsapp: string | null;
  supportEmail: string | null;
  pix: boolean;
  boleto: boolean;
  creditCard: boolean;
  minDonationAmount: number | null;
  totalGoal: number | null;
  monthlyGoal: number | null;
  showProgressBar: boolean;
  progressBase: string | null;
};

class CreateCampaignUseCase {
  constructor(
    private campaignGateway: CampaignGatewayDTO,
    private accountWhatsappSettingsGateway: AccountWhatsappSettingsGatewayDTO,
  ) {}

  async execute(input: InputProps) {
    const address = this.buildAddress(input);

    const { id } = await this.campaignGateway.createCampaign(
      {
        accountId: input.accountId,
        name: input.name,
        slug: input.slug,
        typeDonation: input.typeDonation,
        status: input.status,
        published: input.published,
        startDate: input.startDate,
        endDate: input.endDate,
        phone: input.phone,
        cnpj: input.cnpj,
        institutionName: input.institutionName,
        image: input.image,
        address,
        featuredImage: input.featuredImage,
        imageMobile: input.imageMobile,
        headerImage: input.headerImage,
        videoUrl: input.videoUrl,
        description: input.description,
        projectCategoryId: input.category,
        totalGoal: input.totalGoal,
        monthlyGoal: input.monthlyGoal,
        registrationTitle: input.title,
        whyDonateTitle: input.whyDonateTitle,
        whyDonateText: input.whyDonateText,
        whyDonateImage: input.whyDonateImage,
        aboutUsTitle: input.aboutTitle,
        aboutUsText: input.aboutText,
        aboutUsImage: input.aboutImage,
        supportWhatsapp: input.supportWhatsapp,
        supportEmail: input.supportEmail,
        pixEnable: input.pix,
        bankslipEnable: input.boleto,
        creditEnable: input.creditCard,
        minAmount: input.minDonationAmount,
        showProgressBar: input.showProgressBar,
        progressGoalType: input.progressBase,
      },
      input.token,
    );

    try {
      await this.accountWhatsappSettingsGateway.createAccountWhatsappSettings({
        accountReference: id,
        provider: environmentVariables.DEFAULT_WHATSAPP_SETTINGS_PROVIDER,
        type: environmentVariables.DEFAULT_WHATSAPP_SETTINGS_TYPE,
        active: environmentVariables.DEFAULT_WHATSAPP_SETTINGS_ACTIVE !== "false",
        token: environmentVariables.DEFAULT_WHATSAPP_SETTINGS_TOKEN || undefined,
        utilityFee: parseFloat(environmentVariables.DEFAULT_WHATSAPP_SETTINGS_UTILITY_FEE || "0"),
        marketingFee: parseFloat(environmentVariables.DEFAULT_WHATSAPP_SETTINGS_MARKETING_FEE || "0"),
      });
    } catch (error) {
      console.error("[createCampaignUseCase] Failed to create whatsapp settings:", error);
    }

    return { campaignId: id };
  }

  private buildAddress(input: InputProps): string | null {
    const cityState =
      input.institutionCity && input.institutionState
        ? `${input.institutionCity} - ${input.institutionState}`
        : input.institutionCity || input.institutionState;

    const parts = [
      input.institutionStreet,
      input.institutionNumber,
      input.institutionComplement,
      input.institutionNeighborhood,
      cityState,
      input.institutionCep,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : null;
  }
}

export { CreateCampaignUseCase };
