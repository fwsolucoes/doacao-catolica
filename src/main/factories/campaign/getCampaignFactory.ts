import { GetCampaignUseCase } from "~/app/useCases/campaign/getCampaignUseCase";
import { GetCampaignController } from "~/infra/controllers/campaign/getCampaignController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const getCampaignUseCase = new GetCampaignUseCase(campaignGateway);
const getCampaignController = new GetCampaignController(getCampaignUseCase);

const getCampaign = {
  handle: getCampaignController.handle.bind(getCampaignController),
};

export { getCampaign };
