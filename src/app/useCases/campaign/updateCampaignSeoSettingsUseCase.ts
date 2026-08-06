import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

class UpdateCampaignSeoSettingsUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    await this.campaignGateway.updateCampaignWithDetails(
      {
        campaignId: input.campaignId,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
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
