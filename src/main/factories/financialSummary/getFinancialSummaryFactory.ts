import { GetFinancialSummaryUseCase } from "~/app/useCases/financialSummary/getFinancialSummaryUseCase";
import { GetFinancialSummaryController } from "~/infra/controllers/financialSummary/getFinancialSummaryController";
import { FinancialSummaryGateway } from "~/infra/gateways/financialSummary";

const financialSummaryGateway = new FinancialSummaryGateway();
const getFinancialSummaryUseCase = new GetFinancialSummaryUseCase(
  financialSummaryGateway,
);
const getFinancialSummaryController = new GetFinancialSummaryController(
  getFinancialSummaryUseCase,
);

const getFinancialSummary = {
  handle: getFinancialSummaryController.handle.bind(
    getFinancialSummaryController,
  ),
};

export { getFinancialSummary };
