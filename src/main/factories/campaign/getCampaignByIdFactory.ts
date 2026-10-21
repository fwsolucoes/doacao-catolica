import { GetCampaignUseCase } from "~/app/useCases/campaign/getCampaignUseCase";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const getCampaignUseCase = new GetCampaignUseCase(campaignGateway);

const getCampaignById = {
  handle: (id: string, token: string) =>
    getCampaignUseCase.execute({ id, token }),
};

export { getCampaignById };
