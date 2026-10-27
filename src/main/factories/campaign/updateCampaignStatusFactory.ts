import { UpdateCampaignStatusUseCase } from "~/app/useCases/campaign/updateCampaignStatusUseCase";
import { UpdateCampaignStatusController } from "~/infra/controllers/campaign/updateCampaignStatusController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const updateCampaignStatusUseCase = new UpdateCampaignStatusUseCase(
  campaignGateway,
);
const updateCampaignStatusController = new UpdateCampaignStatusController(
  updateCampaignStatusUseCase,
);

const updateCampaignStatus = {
  handle: updateCampaignStatusController.handle.bind(
    updateCampaignStatusController,
  ),
};

export { updateCampaignStatus };
