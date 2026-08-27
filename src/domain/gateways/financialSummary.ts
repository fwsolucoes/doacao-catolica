import type { FinancialSummarySearchParams } from "~/app/search/financialSummarySearchParams";
import type { FinancialSummaryJson } from "../entities/financialSummary";

type FinancialSummaryGatewayDTO = {
  getFinancialSummary(
    referenceId: string,
    searchParams: FinancialSummarySearchParams,
  ): Promise<FinancialSummaryJson>;
};

export type { FinancialSummaryGatewayDTO };
