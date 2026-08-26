import { GetCampaignUseCase } from "~/app/useCases/campaign/getCampaignUseCase";
import { ListTransferAccountsUseCase } from "~/app/useCases/transferAccount/listTransferAccountsUseCase";
import { ListTransferAccountsController } from "~/infra/controllers/transferAccount/listTransferAccountsController";
import { CampaignGateway } from "~/infra/gateways/campaign";
import { TransferAccountGateway } from "~/infra/gateways/transferAccount";

const campaignGateway = new CampaignGateway();
const getCampaignUseCase = new GetCampaignUseCase(campaignGateway);

const transferAccountGateway = new TransferAccountGateway();
const listTransferAccountsUseCase = new ListTransferAccountsUseCase(
  transferAccountGateway,
);
const listTransferAccountsController = new ListTransferAccountsController(
  listTransferAccountsUseCase,
  getCampaignUseCase,
);

const listTransferAccounts = {
  handle: listTransferAccountsController.handle.bind(
    listTransferAccountsController,
  ),
};

export { listTransferAccounts };
