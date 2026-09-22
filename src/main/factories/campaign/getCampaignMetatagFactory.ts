import { GetCampaignMetatagUseCase } from "~/app/useCases/campaign/getCampaignMetatagUseCase";
import { GetCampaignMetatagController } from "~/infra/controllers/campaign/getCampaignMetatagController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const getCampaignMetatagUseCase = new GetCampaignMetatagUseCase(campaignGateway);
const getCampaignMetatagController = new GetCampaignMetatagController(
  getCampaignMetatagUseCase,
);

const getCampaignMetatag = {
  handle: getCampaignMetatagController.handle.bind(getCampaignMetatagController),
};

export { getCampaignMetatag };
