import { CampaignActivitySearchParams } from "~/app/search/campaignActivitySearchParams";
import type { CampaignActivityGatewayDTO } from "~/domain/gateways/campaignActivity";

type InputProps = {
  campaignId: string;
  month?: number;
  year?: number;
};

class GetCampaignActivityUseCase {
  constructor(private gateway: CampaignActivityGatewayDTO) {}

  async execute({ campaignId, month, year }: InputProps) {
    const searchParams = new CampaignActivitySearchParams({
      filter: { month, year },
    });

    return await this.gateway.getActivity(campaignId, searchParams);
  }
}

export { GetCampaignActivityUseCase };
