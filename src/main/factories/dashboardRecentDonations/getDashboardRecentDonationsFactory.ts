import { GetDashboardRecentDonationsUseCase } from "~/app/useCases/dashboardRecentDonations/getDashboardRecentDonationsUseCase";
import { DashboardRecentDonationsGateway } from "~/infra/gateways/dashboardRecentDonations";

const dashboardRecentDonationsGateway = new DashboardRecentDonationsGateway();
const getDashboardRecentDonationsUseCase =
  new GetDashboardRecentDonationsUseCase(dashboardRecentDonationsGateway);

const getDashboardRecentDonations = {
  handle: (accountUuid: string, limit?: number) =>
    getDashboardRecentDonationsUseCase.execute({ accountUuid, limit }),
};

export { getDashboardRecentDonations };
