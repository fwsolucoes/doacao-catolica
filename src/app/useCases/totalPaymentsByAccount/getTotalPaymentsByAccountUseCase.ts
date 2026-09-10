import { TotalPaymentsByAccountSearchParams } from "~/app/search/totalPaymentsByAccountSearchParams";
import type { TotalPaymentsByAccountGatewayDTO } from "~/domain/gateways/totalPaymentsByAccount";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  accountId: number;
  startDate?: string;
  endDate?: string;
};

class GetTotalPaymentsByAccountUseCase {
  constructor(private gateway: TotalPaymentsByAccountGatewayDTO) {}

  async execute(input: InputProps) {
    const { accountId, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new TotalPaymentsByAccountSearchParams({
      filter: {
        account_reference_2: accountId,
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
      },
    });

    return this.gateway.getTotalPaymentsByAccount(searchParams);
  }
}

export { GetTotalPaymentsByAccountUseCase };
