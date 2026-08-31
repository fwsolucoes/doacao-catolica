import { CreateCampaignUseCase } from "~/app/useCases/campaign/createCampaignUseCase";
import { CreateCampaignController } from "~/infra/controllers/campaign/createCampaignController";
import { AccountWhatsappSettingsGateway } from "~/infra/gateways/accountWhatsappSettings";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const accountWhatsappSettingsGateway = new AccountWhatsappSettingsGateway();
const createCampaignUseCase = new CreateCampaignUseCase(campaignGateway, accountWhatsappSettingsGateway);
const createCampaignController = new CreateCampaignController(createCampaignUseCase);

const createCampaign = {
  handle: createCampaignController.handle.bind(createCampaignController),
};

export { createCampaign };
