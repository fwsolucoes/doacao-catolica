import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  status: boolean;
};

class UpdateCampaignStatusUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    await this.campaignGateway.updateCampaignWithDetails(
      { campaignId: input.campaignId, status: input.status },
      input.token,
    );

    return {
      toast: {
        message: input.status
          ? "Campanha retomada com sucesso!"
          : "Campanha pausada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignStatusUseCase };
