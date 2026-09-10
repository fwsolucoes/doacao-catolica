import { ListCampaignSelectUseCase } from "~/app/useCases/campaignSelect/listCampaignSelectUseCase";
import { ListCampaignSelectController } from "~/infra/controllers/campaignSelect/listCampaignSelectController";
import { CampaignSelectDal } from "~/infra/dal/campaignSelect";

const campaignSelectDal = new CampaignSelectDal();
const listCampaignSelectUseCase = new ListCampaignSelectUseCase(campaignSelectDal);
const listCampaignSelectController = new ListCampaignSelectController(listCampaignSelectUseCase);

const listCampaignSelect = {
  handle: listCampaignSelectController.handle.bind(listCampaignSelectController),
};

export { listCampaignSelect };
