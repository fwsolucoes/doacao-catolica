import { GetCampaignIntegrationsUseCase } from "~/app/useCases/campaign/getCampaignIntegrationsUseCase";
import { GetCampaignIntegrationsController } from "~/infra/controllers/campaign/getCampaignIntegrationsController";
import { CampaignIntegrationsGateway } from "~/infra/gateways/campaignIntegrations";

const campaignIntegrationsGateway = new CampaignIntegrationsGateway();
const getCampaignIntegrationsUseCase = new GetCampaignIntegrationsUseCase(
  campaignIntegrationsGateway,
);
const getCampaignIntegrationsController = new GetCampaignIntegrationsController(
  getCampaignIntegrationsUseCase,
);

const getCampaignIntegrations = {
  handle: getCampaignIntegrationsController.handle.bind(
    getCampaignIntegrationsController,
  ),
};

export { getCampaignIntegrations };
