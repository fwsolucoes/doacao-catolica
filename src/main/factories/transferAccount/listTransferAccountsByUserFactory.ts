import { ListTransferAccountsUseCase } from "~/app/useCases/transferAccount/listTransferAccountsUseCase";
import { ListTransferAccountsByUserController } from "~/infra/controllers/transferAccount/listTransferAccountsByUserController";
import { TransferAccountGateway } from "~/infra/gateways/transferAccount";

const transferAccountGateway = new TransferAccountGateway();
const listTransferAccountsByUserController =
  new ListTransferAccountsByUserController(
    new ListTransferAccountsUseCase(transferAccountGateway),
  );

const listTransferAccountsByUser = {
  handle: listTransferAccountsByUserController.handle.bind(
    listTransferAccountsByUserController,
  ),
};

export { listTransferAccountsByUser };
