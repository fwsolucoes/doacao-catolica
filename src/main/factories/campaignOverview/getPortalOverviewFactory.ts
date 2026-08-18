import { GetCampaignOverviewUseCase } from "~/app/useCases/campaignOverview/getCampaignOverviewUseCase";
import { CampaignOverviewGateway } from "~/infra/gateways/campaignOverview";

const campaignOverviewGateway = new CampaignOverviewGateway();
const getCampaignOverviewUseCase = new GetCampaignOverviewUseCase(
  campaignOverviewGateway,
);

const getPortalOverview = {
  handle: (accountUuid: string) =>
    getCampaignOverviewUseCase.execute({ campaignId: accountUuid }),
};

export { getPortalOverview };
