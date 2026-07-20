import { VerifySlugUseCase } from "~/app/useCases/campaign/verifySlugUseCase";
import { VerifySlugController } from "~/infra/controllers/campaign/verifySlugController";
import { CampaignGateway } from "~/infra/gateways/campaign";

const campaignGateway = new CampaignGateway();
const verifySlugUseCase = new VerifySlugUseCase(campaignGateway);
const verifySlugController = new VerifySlugController(verifySlugUseCase);

const verifySlug = {
  handle: verifySlugController.handle.bind(verifySlugController),
};

export { verifySlug };
