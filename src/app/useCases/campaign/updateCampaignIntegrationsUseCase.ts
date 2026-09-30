import type { CampaignIntegrationsGatewayDTO } from "~/domain/gateways/campaignIntegrations";

type InputProps = {
  campaignId: string;
  token: string;
  googleAnalyticsPixel: string | null;
  googleTagManagerPixel: string | null;
  facebookPixel: string | null;
  facebookEnable: boolean;
  googleAnalyticsEnable: boolean;
};

class UpdateCampaignIntegrationsUseCase {
  constructor(
    private campaignIntegrationsGateway: CampaignIntegrationsGatewayDTO,
  ) {}

  async execute(input: InputProps) {
    await this.campaignIntegrationsGateway.updateCampaignIntegrations(
      input.campaignId,
      {
        googleAnalyticsPixel: input.googleAnalyticsPixel,
        googleTagManagerPixel: input.googleTagManagerPixel,
        facebookPixel: input.facebookPixel,
        facebookEnable: input.facebookEnable,
        googleAnalyticsEnable: input.googleAnalyticsEnable,
      },
      input.token,
    );

    return {
      toast: {
        message: "Integrações salvas com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignIntegrationsUseCase };
