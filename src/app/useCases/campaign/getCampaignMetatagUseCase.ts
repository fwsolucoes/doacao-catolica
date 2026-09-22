import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
};

class GetCampaignMetatagUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    return this.campaignGateway.getCampaignMetatag(input.campaignId, input.token);
  }
}

export { GetCampaignMetatagUseCase };
