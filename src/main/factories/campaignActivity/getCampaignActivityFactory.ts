import { GetCampaignActivityUseCase } from "~/app/useCases/campaignActivity/getCampaignActivityUseCase";
import { GetCampaignActivityController } from "~/infra/controllers/campaignActivity/getCampaignActivityController";
import { CampaignActivityGateway } from "~/infra/gateways/campaignActivity";

const campaignActivityGateway = new CampaignActivityGateway();
const getCampaignActivityUseCase = new GetCampaignActivityUseCase(
  campaignActivityGateway,
);
const getCampaignActivityController = new GetCampaignActivityController(
  getCampaignActivityUseCase,
);

const getCampaignActivity = {
  handle: getCampaignActivityController.handle.bind(
    getCampaignActivityController,
  ),
};

export { getCampaignActivity };
