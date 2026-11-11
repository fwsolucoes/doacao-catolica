import { CampaignOverviewByAccountSearchParams } from "~/app/search/campaignOverviewByAccountSearchParams";
import type { CampaignOverviewByAccountGatewayDTO } from "~/domain/gateways/campaignOverviewByAccount";

type InputProps = {
  accountId: number;
  month?: number;
  year?: number;
};

class GetCampaignOverviewByAccountUseCase {
  constructor(private gateway: CampaignOverviewByAccountGatewayDTO) {}

  async execute({ accountId, month, year }: InputProps) {
    const searchParams = new CampaignOverviewByAccountSearchParams({
      filter: { account_reference_2: accountId, month, year },
    });

    return await this.gateway.getOverview(searchParams);
  }
}

export { GetCampaignOverviewByAccountUseCase };
