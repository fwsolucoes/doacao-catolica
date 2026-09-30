import type { CampaignIntegrationsGatewayDTO } from "~/domain/gateways/campaignIntegrations";

type InputProps = {
  campaignId: string;
  token: string;
};

class GetCampaignIntegrationsUseCase {
  constructor(
    private campaignIntegrationsGateway: CampaignIntegrationsGatewayDTO,
  ) {}

  async execute(input: InputProps) {
    return this.campaignIntegrationsGateway.getCampaignIntegrations(
      input.campaignId,
      input.token,
    );
  }
}

export { GetCampaignIntegrationsUseCase };
