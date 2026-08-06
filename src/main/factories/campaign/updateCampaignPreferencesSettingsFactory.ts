import { UpdateCampaignPreferencesSettingsUseCase } from "~/app/useCases/campaign/updateCampaignPreferencesSettingsUseCase";
import { UpdateCampaignPreferencesSettingsController } from "~/infra/controllers/campaign/updateCampaignPreferencesSettingsController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const updateCampaignPreferencesSettingsUseCase =
  new UpdateCampaignPreferencesSettingsUseCase(campaignGateway);
const updateCampaignPreferencesSettingsController =
  new UpdateCampaignPreferencesSettingsController(
    updateCampaignPreferencesSettingsUseCase,
  );

const updateCampaignPreferencesSettings = {
  handle: updateCampaignPreferencesSettingsController.handle.bind(
    updateCampaignPreferencesSettingsController,
  ),
};

export { updateCampaignPreferencesSettings };
