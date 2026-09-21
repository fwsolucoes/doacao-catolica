import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  title: string | null;
  description: string | null;
  featuredImage: string | null;
  imageMobile: string | null;
  videoUrl: string | null;
  headerImage: string | null;
  whyDonateEnabled: boolean;
  whyDonateTitle: string | null;
  whyDonateText: string | null;
  whyDonateImage: string | null;
  aboutUsEnabled: boolean;
  aboutTitle: string | null;
  aboutText: string | null;
  aboutImage: string | null;
  supportWhatsapp: string | null;
  supportEmail: string | null;
};

class UpdateCampaignPageUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    await this.campaignGateway.updateCampaignWithDetails(
      {
        campaignId: input.campaignId,
        image: input.featuredImage,
        imageMobile: input.imageMobile,
        videoUrl: input.videoUrl,
        headerImage: input.headerImage,
        title: input.title,
        description: input.description,
        whyDonateEnabled: input.whyDonateEnabled,
        whyDonateTitle: input.whyDonateTitle,
        whyDonateText: input.whyDonateText,
        whyDonateImage: input.whyDonateImage,
        aboutUsEnabled: input.aboutUsEnabled,
        aboutTitle: input.aboutTitle,
        aboutText: input.aboutText,
        aboutImage: input.aboutImage,
        supportWhatsapp: input.supportWhatsapp,
        supportEmail: input.supportEmail,
      },
      input.token,
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
