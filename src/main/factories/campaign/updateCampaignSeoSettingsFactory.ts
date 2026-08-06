import { UpdateCampaignSeoSettingsUseCase } from "~/app/useCases/campaign/updateCampaignSeoSettingsUseCase";
import { UpdateCampaignSeoSettingsController } from "~/infra/controllers/campaign/updateCampaignSeoSettingsController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const updateCampaignSeoSettingsUseCase = new UpdateCampaignSeoSettingsUseCase(
  campaignGateway,
);
const updateCampaignSeoSettingsController =
  new UpdateCampaignSeoSettingsController(updateCampaignSeoSettingsUseCase);

const updateCampaignSeoSettings = {
  handle: updateCampaignSeoSettingsController.handle.bind(
    updateCampaignSeoSettingsController,
  ),
};

export { updateCampaignSeoSettings };
