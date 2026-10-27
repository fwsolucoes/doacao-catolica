import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  endDate: string;
};

class CloseCampaignUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    await this.campaignGateway.updateCampaignWithDetails(
      {
        campaignId: input.campaignId,
        status: false,
        endDate: input.endDate,
        noEndDate: false,
      },
      input.token,
    );

    return {
      toast: {
        message: "Campanha encerrada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { CloseCampaignUseCase };
