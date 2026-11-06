import { GetCampaignOverviewByAccountUseCase } from "~/app/useCases/campaignOverviewByAccount/getCampaignOverviewByAccountUseCase";
import { CampaignOverviewByAccountGateway } from "~/infra/gateways/campaignOverviewByAccount";

const campaignOverviewByAccountGateway = new CampaignOverviewByAccountGateway();
const getCampaignOverviewByAccountUseCase = new GetCampaignOverviewByAccountUseCase(
  campaignOverviewByAccountGateway,
);

const getPortalOverviewByAccount = {
  handle: (accountId: number) =>
    getCampaignOverviewByAccountUseCase.execute({ accountId }),
};

export { getPortalOverviewByAccount };
