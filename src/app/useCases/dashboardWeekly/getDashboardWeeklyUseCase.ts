import { DashboardWeeklySearchParams } from "~/app/search/dashboardWeeklySearchParams";
import type { DashboardWeeklyGatewayDTO } from "~/domain/gateways/dashboardWeekly";

type InputProps = {
  accountUuid: string;
  date?: string;
};

class GetDashboardWeeklyUseCase {
  constructor(private gateway: DashboardWeeklyGatewayDTO) {}

  async execute({ accountUuid, date }: InputProps) {
    const searchParams = new DashboardWeeklySearchParams({
      filter: { date },
    });

    return await this.gateway.getWeekly(accountUuid, searchParams);
  }
}

export { GetDashboardWeeklyUseCase };
