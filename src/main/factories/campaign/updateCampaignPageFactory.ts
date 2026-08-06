import { UpdateCampaignPageUseCase } from "~/app/useCases/campaign/updateCampaignPageUseCase";
import { UpdateCampaignPageController } from "~/infra/controllers/campaign/updateCampaignPageController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const updateCampaignPageUseCase = new UpdateCampaignPageUseCase(campaignGateway);
const updateCampaignPageController = new UpdateCampaignPageController(
  updateCampaignPageUseCase,
);

const updateCampaignPage = {
  handle: updateCampaignPageController.handle.bind(updateCampaignPageController),
};

export { updateCampaignPage };
