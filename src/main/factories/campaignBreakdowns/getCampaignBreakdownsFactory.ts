import { GetCampaignBreakdownsUseCase } from "~/app/useCases/campaignBreakdowns/getCampaignBreakdownsUseCase";
import { GetCampaignBreakdownsController } from "~/infra/controllers/campaignBreakdowns/getCampaignBreakdownsController";
import { CampaignBreakdownsGateway } from "~/infra/gateways/campaignBreakdowns";

const campaignBreakdownsGateway = new CampaignBreakdownsGateway();
const getCampaignBreakdownsUseCase = new GetCampaignBreakdownsUseCase(
  campaignBreakdownsGateway,
);
const getCampaignBreakdownsController = new GetCampaignBreakdownsController(
  getCampaignBreakdownsUseCase,
);

const getCampaignBreakdowns = {
  handle: getCampaignBreakdownsController.handle.bind(
    getCampaignBreakdownsController,
  ),
};

export { getCampaignBreakdowns };
