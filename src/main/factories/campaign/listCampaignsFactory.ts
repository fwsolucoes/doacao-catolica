import { ListCampaignsUseCase } from "~/app/useCases/campaign/listCampaignsUseCase";
import { ListCampaignsController } from "~/infra/controllers/campaign/listCampaignsController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const listCampaignsUseCase = new ListCampaignsUseCase(campaignGateway);
const listCampaignsController = new ListCampaignsController(listCampaignsUseCase);

const listCampaigns = {
  handle: listCampaignsController.handle.bind(listCampaignsController),
};

export { listCampaigns };
