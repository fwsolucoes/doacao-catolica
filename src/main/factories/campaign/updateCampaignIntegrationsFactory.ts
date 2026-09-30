import { UpdateCampaignIntegrationsUseCase } from "~/app/useCases/campaign/updateCampaignIntegrationsUseCase";
import { UpdateCampaignIntegrationsController } from "~/infra/controllers/campaign/updateCampaignIntegrationsController";
import { CampaignIntegrationsGateway } from "~/infra/gateways/campaignIntegrations";

const campaignIntegrationsGateway = new CampaignIntegrationsGateway();
const updateCampaignIntegrationsUseCase = new UpdateCampaignIntegrationsUseCase(
  campaignIntegrationsGateway,
);
const updateCampaignIntegrationsController =
  new UpdateCampaignIntegrationsController(updateCampaignIntegrationsUseCase);

const updateCampaignIntegrations = {
  handle: updateCampaignIntegrationsController.handle.bind(
    updateCampaignIntegrationsController,
  ),
};

export { updateCampaignIntegrations };
