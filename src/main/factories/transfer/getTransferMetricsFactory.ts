import { GetTransferMetricsUseCase } from "~/app/useCases/transfer/getTransferMetricsUseCase";
import { GetTransferMetricsController } from "~/infra/controllers/transfer/getTransferMetricsController";
import { TransferGateway } from "~/infra/gateways/transfer";

const transferGateway = new TransferGateway();
const getTransferMetricsUseCase = new GetTransferMetricsUseCase(transferGateway);
const getTransferMetricsController = new GetTransferMetricsController(
  getTransferMetricsUseCase,
);

const getTransferMetrics = {
  handle: getTransferMetricsController.handle.bind(getTransferMetricsController),
};

export { getTransferMetrics };
