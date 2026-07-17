import { CampaignBreakdownsSearchParams } from "~/app/search/campaignBreakdownsSearchParams";
import type { CampaignBreakdownsGatewayDTO } from "~/domain/gateways/campaignBreakdowns";

type InputProps = {
  campaignId: string;
  month?: number;
  year?: number;
};

class GetCampaignBreakdownsUseCase {
  constructor(private gateway: CampaignBreakdownsGatewayDTO) {}

  async execute({ campaignId, month, year }: InputProps) {
    const searchParams = new CampaignBreakdownsSearchParams({
      filter: { month, year },
    });

    return await this.gateway.getBreakdowns(campaignId, searchParams);
  }
}

export { GetCampaignBreakdownsUseCase };
