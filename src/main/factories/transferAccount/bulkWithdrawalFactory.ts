import { BulkWithdrawalUseCase } from "~/app/useCases/transferAccount/bulkWithdrawalUseCase";
import { BulkWithdrawalController } from "~/infra/controllers/transferAccount/bulkWithdrawalController";
import { TransferAccountGateway } from "~/infra/gateways/transferAccount";

const transferAccountGateway = new TransferAccountGateway();
const bulkWithdrawalUseCase = new BulkWithdrawalUseCase(transferAccountGateway);
const bulkWithdrawalController = new BulkWithdrawalController(bulkWithdrawalUseCase);

const bulkWithdrawal = {
  handle: bulkWithdrawalController.handle.bind(bulkWithdrawalController),
};

export { bulkWithdrawal };
