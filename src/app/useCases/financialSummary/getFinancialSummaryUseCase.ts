import { FinancialSummarySearchParams } from "~/app/search/financialSummarySearchParams";
import type { FinancialSummaryGatewayDTO } from "~/domain/gateways/financialSummary";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  referenceId: string;
  dateType?: string;
  startDate?: string;
  endDate?: string;
};

class GetFinancialSummaryUseCase {
  constructor(private gateway: FinancialSummaryGatewayDTO) {}

  async execute(input: InputProps) {
    const { referenceId, dateType, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new FinancialSummarySearchParams({
      filter: {
        date_type: dateType ?? "paid_date",
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
      },
    });

    return this.gateway.getFinancialSummary(referenceId, searchParams);
  }
}

export { GetFinancialSummaryUseCase };
