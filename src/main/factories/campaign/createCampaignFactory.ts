import { CreateCampaignUseCase } from "~/app/useCases/campaign/createCampaignUseCase";
import { CreateCampaignController } from "~/infra/controllers/campaign/createCampaignController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const createCampaignUseCase = new CreateCampaignUseCase(campaignGateway);
const createCampaignController = new CreateCampaignController(createCampaignUseCase);

const createCampaign = {
  handle: createCampaignController.handle.bind(createCampaignController),
};

export { createCampaign };
