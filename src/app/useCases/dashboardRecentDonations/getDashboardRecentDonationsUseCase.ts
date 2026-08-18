import { DashboardRecentDonationsSearchParams } from "~/app/search/dashboardRecentDonationsSearchParams";
import type { DashboardRecentDonationsGatewayDTO } from "~/domain/gateways/dashboardRecentDonations";

type InputProps = {
  accountUuid: string;
  limit?: number;
};

class GetDashboardRecentDonationsUseCase {
  constructor(private gateway: DashboardRecentDonationsGatewayDTO) {}

  async execute({ accountUuid, limit }: InputProps) {
    const searchParams = new DashboardRecentDonationsSearchParams({
      filter: { limit },
    });

    return await this.gateway.getRecentDonations(accountUuid, searchParams);
  }
}

export { GetDashboardRecentDonationsUseCase };
