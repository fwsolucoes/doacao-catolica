import type { CampaignPreferencesGatewayDTO } from "~/domain/gateways/campaignPreferences";

type InputProps = {
  campaignId: string;
  token: string;
};

class GetCampaignPreferencesUseCase {
  constructor(private campaignPreferencesGateway: CampaignPreferencesGatewayDTO) {}

  async execute(input: InputProps) {
    return this.campaignPreferencesGateway.getCampaignPreferences(
      input.campaignId,
      input.token,
    );
  }
}

export { GetCampaignPreferencesUseCase };
