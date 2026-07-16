import { RequestWithdrawalUseCase } from "~/app/useCases/transferAccount/requestWithdrawalUseCase";
import { RequestWithdrawalController } from "~/infra/controllers/transferAccount/requestWithdrawalController";
import { TransferAccountGateway } from "~/infra/gateways/transferAccount";

const transferAccountGateway = new TransferAccountGateway();
const requestWithdrawalUseCase = new RequestWithdrawalUseCase(
  transferAccountGateway,
);
const requestWithdrawalController = new RequestWithdrawalController(
  requestWithdrawalUseCase,
);

const requestWithdrawal = {
  handle: requestWithdrawalController.handle.bind(requestWithdrawalController),
};

export { requestWithdrawal };
