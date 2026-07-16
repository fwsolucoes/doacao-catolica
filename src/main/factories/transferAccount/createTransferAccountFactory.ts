import { CreateTransferAccountUseCase } from "~/app/useCases/transferAccount/createTransferAccountUseCase";
import { CreateTransferAccountController } from "~/infra/controllers/transferAccount/createTransferAccountController";
import { TransferAccountGateway } from "~/infra/gateways/transferAccount";

const transferAccountGateway = new TransferAccountGateway();
const createTransferAccountUseCase = new CreateTransferAccountUseCase(
  transferAccountGateway,
);
const createTransferAccountController = new CreateTransferAccountController(
  createTransferAccountUseCase,
);

const createTransferAccount = {
  handle: createTransferAccountController.handle.bind(
    createTransferAccountController,
  ),
};

export { createTransferAccount };
