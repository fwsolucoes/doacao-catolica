import { UpdateCampaignGeneralInfoUseCase } from "~/app/useCases/campaign/updateCampaignGeneralInfoUseCase";
import { UpdateCampaignGeneralInfoController } from "~/infra/controllers/campaign/updateCampaignGeneralInfoController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const updateCampaignGeneralInfoUseCase = new UpdateCampaignGeneralInfoUseCase(
  campaignGateway,
);
const updateCampaignGeneralInfoController =
  new UpdateCampaignGeneralInfoController(updateCampaignGeneralInfoUseCase);

const updateCampaignGeneralInfo = {
  handle: updateCampaignGeneralInfoController.handle.bind(
    updateCampaignGeneralInfoController,
  ),
};

export { updateCampaignGeneralInfo };
