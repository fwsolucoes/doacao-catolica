import { GetTotalPaymentsByAccountUseCase } from "~/app/useCases/totalPaymentsByAccount/getTotalPaymentsByAccountUseCase";
import { TotalPaymentsByAccountGateway } from "~/infra/gateways/totalPaymentsByAccount";

const totalPaymentsByAccountGateway = new TotalPaymentsByAccountGateway();
const getTotalPaymentsByAccountUseCase = new GetTotalPaymentsByAccountUseCase(
  totalPaymentsByAccountGateway,
);

const getTotalPaymentsByAccount = {
  handle: (accountId: number, startDate?: string, endDate?: string) =>
    getTotalPaymentsByAccountUseCase.execute({ accountId, startDate, endDate }),
};

export { getTotalPaymentsByAccount };
