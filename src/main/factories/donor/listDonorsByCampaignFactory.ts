import { ListDonorsByCampaignUseCase } from "~/app/useCases/donor/listDonorsByCampaignUseCase";
import { ListDonorsByCampaignController } from "~/infra/controllers/donor/listDonorsByCampaignController";
import { CampaignGateway } from "~/infra/gateways/campaign";
import { DonorGateway } from "~/infra/gateways/donor";

const campaignGateway = new CampaignGateway();
const donorGateway = new DonorGateway();
const listDonorsByCampaignUseCase = new ListDonorsByCampaignUseCase(
  campaignGateway,
  donorGateway,
);
const listDonorsByCampaignController = new ListDonorsByCampaignController(
  listDonorsByCampaignUseCase,
);

const listDonorsByCampaign = {
  handle: listDonorsByCampaignController.handle.bind(
    listDonorsByCampaignController,
  ),
};

export { listDonorsByCampaign };
