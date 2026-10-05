import { UpdateCampaignGeneralInfoUseCase } from "~/app/useCases/campaign/updateCampaignGeneralInfoUseCase";
import { UpdateCampaignGeneralInfoController } from "~/infra/controllers/campaign/updateCampaignGeneralInfoController";
import { CampaignGateway } from "~/infra/gateways/campaign";
import { DonationAccountGateway } from "~/infra/gateways/donationAccount";

const campaignGateway = new CampaignGateway();
const donationAccountGateway = new DonationAccountGateway();
const updateCampaignGeneralInfoUseCase = new UpdateCampaignGeneralInfoUseCase(
  campaignGateway,
  donationAccountGateway,
);
const updateCampaignGeneralInfoController =
  new UpdateCampaignGeneralInfoController(updateCampaignGeneralInfoUseCase);

const updateCampaignGeneralInfo = {
  handle: updateCampaignGeneralInfoController.handle.bind(
    updateCampaignGeneralInfoController,
  ),
};

export { updateCampaignGeneralInfo };
