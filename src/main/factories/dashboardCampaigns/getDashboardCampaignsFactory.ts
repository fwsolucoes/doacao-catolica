import { GetDashboardCampaignsUseCase } from "~/app/useCases/dashboardCampaigns/getDashboardCampaignsUseCase";
import { DashboardCampaignsGateway } from "~/infra/gateways/dashboardCampaigns";

const dashboardCampaignsGateway = new DashboardCampaignsGateway();
const getDashboardCampaignsUseCase = new GetDashboardCampaignsUseCase(
  dashboardCampaignsGateway,
);

const getDashboardCampaigns = {
  handle: (
    accountUuid: string,
    month?: number,
    year?: number,
    limit?: number,
  ) =>
    getDashboardCampaignsUseCase.execute({ accountUuid, month, year, limit }),
};

export { getDashboardCampaigns };
