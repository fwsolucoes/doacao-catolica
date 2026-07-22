import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";
import type { CampaignPreferencesGatewayDTO } from "~/domain/gateways/campaignPreferences";

type InputProps = {
  campaignId: string;
  token: string;
  title: string | null;
  description: string | null;
  image: string | null;
  imageMobile: string | null;
  videoUrl: string | null;
  headerImage: string | null;
  whyDonateTitle: string | null;
  whyDonateText: string | null;
  whyDonateImage: string | null;
  aboutUsTitle: string | null;
  aboutUsText: string | null;
  aboutUsImage: string | null;
  supportWhatsapp: string | null;
  supportEmail: string | null;
};

class UpdateCampaignPageUseCase {
  constructor(
    private campaignGateway: CampaignGatewayDTO,
    private campaignPreferencesGateway: CampaignPreferencesGatewayDTO,
  ) {}

  async execute(input: InputProps) {
    const { campaignId, token } = input;

    const [campaign, preferences] = await Promise.all([
      this.campaignGateway.getCampaign(campaignId, token),
      this.campaignPreferencesGateway.getCampaignPreferences(campaignId, token),
    ]);

    await this.campaignPreferencesGateway.updateCampaignPreferences(
      preferences.id,
      {
        title: input.title,
        description: input.description,
        whyDonateTitle: input.whyDonateTitle,
        whyDonateText: input.whyDonateText,
        whyDonateImage: input.whyDonateImage,
        aboutUsTitle: input.aboutUsTitle,
        aboutUsText: input.aboutUsText,
        aboutUsImage: input.aboutUsImage,
        supportWhatsapp: input.supportWhatsapp,
        supportEmail: input.supportEmail,
      },
      token,
    );

    await this.campaignGateway.updateCampaignPage(
      {
        campaignId,
        subAccountId: campaign.subAccountId,
        name: campaign.name,
        slug: campaign.slug,
        status: campaign.status,
        published: campaign.published,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        noEndDate: campaign.noEndDate,
        phone: campaign.phone,
        typeDonation: campaign.typeDonation,
        totalGoal: campaign.totalGoal ? parseFloat(campaign.totalGoal) : null,
        monthlyGoal: campaign.monthlyGoal
          ? parseFloat(campaign.monthlyGoal)
          : null,
        institutionName: campaign.institutionName,
        cnpj: campaign.cnpj,
        address: campaign.address,
        email: campaign.email,
        type: campaign.type,
        description: input.description,
        image: input.image,
        imageMobile: input.imageMobile,
        videoUrl: input.videoUrl,
        headerImage: input.headerImage,
      },
      token,
    );

    return {
      toast: {
        message: "Campanha atualizada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignPageUseCase };
