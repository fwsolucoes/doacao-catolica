import { ListTransferAccountsUseCase } from "~/app/useCases/transferAccount/listTransferAccountsUseCase";
import { ListTransferAccountsController } from "~/infra/controllers/transferAccount/listTransferAccountsController";
import { TransferAccountGateway } from "~/infra/gateways/transferAccount";

const transferAccountGateway = new TransferAccountGateway();
const listTransferAccountsUseCase = new ListTransferAccountsUseCase(
  transferAccountGateway,
);
const listTransferAccountsController = new ListTransferAccountsController(
  listTransferAccountsUseCase,
);

const listTransferAccounts = {
  handle: listTransferAccountsController.handle.bind(
    listTransferAccountsController,
  ),
};

export { listTransferAccounts };
