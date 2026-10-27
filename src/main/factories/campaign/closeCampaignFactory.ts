import { CloseCampaignUseCase } from "~/app/useCases/campaign/closeCampaignUseCase";
import { CloseCampaignController } from "~/infra/controllers/campaign/closeCampaignController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const closeCampaignUseCase = new CloseCampaignUseCase(campaignGateway);
const closeCampaignController = new CloseCampaignController(
  closeCampaignUseCase,
);

const closeCampaign = {
  handle: closeCampaignController.handle.bind(closeCampaignController),
};

export { closeCampaign };
