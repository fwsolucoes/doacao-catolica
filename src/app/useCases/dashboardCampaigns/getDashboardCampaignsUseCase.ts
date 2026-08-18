import { DashboardCampaignsSearchParams } from "~/app/search/dashboardCampaignsSearchParams";
import type { DashboardCampaignsGatewayDTO } from "~/domain/gateways/dashboardCampaigns";

type InputProps = {
  accountUuid: string;
  month?: number;
  year?: number;
  limit?: number;
};

class GetDashboardCampaignsUseCase {
  constructor(private gateway: DashboardCampaignsGatewayDTO) {}

  async execute({ accountUuid, month, year, limit }: InputProps) {
    const searchParams = new DashboardCampaignsSearchParams({
      filter: { month, year, limit },
    });

    return await this.gateway.getCampaigns(accountUuid, searchParams);
  }
}

export { GetDashboardCampaignsUseCase };
