import { GetDashboardWeeklyUseCase } from "~/app/useCases/dashboardWeekly/getDashboardWeeklyUseCase";
import { DashboardWeeklyGateway } from "~/infra/gateways/dashboardWeekly";

const dashboardWeeklyGateway = new DashboardWeeklyGateway();
const getDashboardWeeklyUseCase = new GetDashboardWeeklyUseCase(
  dashboardWeeklyGateway,
);

const getDashboardWeekly = {
  handle: (accountUuid: string, date?: string) =>
    getDashboardWeeklyUseCase.execute({ accountUuid, date }),
};

export { getDashboardWeekly };
