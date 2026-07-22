import { UpdateCampaignPageUseCase } from "~/app/useCases/campaign/updateCampaignPageUseCase";
import { UpdateCampaignPageController } from "~/infra/controllers/campaign/updateCampaignPageController";
import { CampaignGateway } from "~/infra/gateways/campaign";
import { CampaignPreferencesGateway } from "~/infra/gateways/campaignPreferences";

const campaignGateway = new CampaignGateway();
const campaignPreferencesGateway = new CampaignPreferencesGateway();
const updateCampaignPageUseCase = new UpdateCampaignPageUseCase(
  campaignGateway,
  campaignPreferencesGateway,
);
const updateCampaignPageController = new UpdateCampaignPageController(
  updateCampaignPageUseCase,
);

const updateCampaignPage = {
  handle: updateCampaignPageController.handle.bind(updateCampaignPageController),
};

export { updateCampaignPage };
