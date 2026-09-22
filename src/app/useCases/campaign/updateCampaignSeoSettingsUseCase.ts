import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
};

class UpdateCampaignSeoSettingsUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    await this.campaignGateway.updateCampaignWithDetails(
      {
        campaignId: input.campaignId,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        metaKeywords: input.keywords,
        ogTitle: input.ogTitle,
        ogDescription: input.ogDescription,
      },
      input.token,
    );

    return {
      toast: {
        message: "Metadados SEO salvos com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignSeoSettingsUseCase };
