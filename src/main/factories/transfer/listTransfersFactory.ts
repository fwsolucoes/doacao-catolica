import { ListTransfersUseCase } from "~/app/useCases/transfer/listTransfersUseCase";
import { ListTransfersController } from "~/infra/controllers/transfer/listTransfersController";
import { TransferGateway } from "~/infra/gateways/transfer";

const transferGateway = new TransferGateway();
const listTransfersUseCase = new ListTransfersUseCase(transferGateway);
const listTransfersController = new ListTransfersController(listTransfersUseCase);

const listTransfers = {
  handle: listTransfersController.handle.bind(listTransfersController),
};

export { listTransfers };
