import { GetCampaignPreferencesUseCase } from "~/app/useCases/campaign/getCampaignPreferencesUseCase";
import { GetCampaignPreferencesController } from "~/infra/controllers/campaign/getCampaignPreferencesController";
import { CampaignPreferencesGateway } from "~/infra/gateways/campaignPreferences";

const campaignPreferencesGateway = new CampaignPreferencesGateway();
const getCampaignPreferencesUseCase = new GetCampaignPreferencesUseCase(
  campaignPreferencesGateway,
);
const getCampaignPreferencesController = new GetCampaignPreferencesController(
  getCampaignPreferencesUseCase,
);

const getCampaignPreferences = {
  handle: getCampaignPreferencesController.handle.bind(
    getCampaignPreferencesController,
  ),
};

export { getCampaignPreferences };
