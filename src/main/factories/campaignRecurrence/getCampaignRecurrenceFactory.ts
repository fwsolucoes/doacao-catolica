import { GetCampaignRecurrenceUseCase } from "~/app/useCases/campaignRecurrence/getCampaignRecurrenceUseCase";
import { GetCampaignRecurrenceController } from "~/infra/controllers/campaignRecurrence/getCampaignRecurrenceController";
import { CampaignRecurrenceGateway } from "~/infra/gateways/campaignRecurrence";

const campaignRecurrenceGateway = new CampaignRecurrenceGateway();
const getCampaignRecurrenceUseCase = new GetCampaignRecurrenceUseCase(
  campaignRecurrenceGateway,
);
const getCampaignRecurrenceController = new GetCampaignRecurrenceController(
  getCampaignRecurrenceUseCase,
);

const getCampaignRecurrence = {
  handle: getCampaignRecurrenceController.handle.bind(
    getCampaignRecurrenceController,
  ),
};

export { getCampaignRecurrence };
