import { UpdateCampaignEmailSettingsUseCase } from "~/app/useCases/campaign/updateCampaignEmailSettingsUseCase";
import { UpdateCampaignEmailSettingsController } from "~/infra/controllers/campaign/updateCampaignEmailSettingsController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const updateCampaignEmailSettingsUseCase =
  new UpdateCampaignEmailSettingsUseCase(campaignGateway);
const updateCampaignEmailSettingsController =
  new UpdateCampaignEmailSettingsController(updateCampaignEmailSettingsUseCase);

const updateCampaignEmailSettings = {
  handle: updateCampaignEmailSettingsController.handle.bind(
    updateCampaignEmailSettingsController,
  ),
};

export { updateCampaignEmailSettings };
