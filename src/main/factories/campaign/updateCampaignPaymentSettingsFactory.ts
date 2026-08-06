import { UpdateCampaignPaymentSettingsUseCase } from "~/app/useCases/campaign/updateCampaignPaymentSettingsUseCase";
import { UpdateCampaignPaymentSettingsController } from "~/infra/controllers/campaign/updateCampaignPaymentSettingsController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const updateCampaignPaymentSettingsUseCase =
  new UpdateCampaignPaymentSettingsUseCase(campaignGateway);
const updateCampaignPaymentSettingsController =
  new UpdateCampaignPaymentSettingsController(
    updateCampaignPaymentSettingsUseCase,
  );

const updateCampaignPaymentSettings = {
  handle: updateCampaignPaymentSettingsController.handle.bind(
    updateCampaignPaymentSettingsController,
  ),
};

export { updateCampaignPaymentSettings };
