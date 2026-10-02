import { TotalPaymentsByAccountSearchParams } from "~/app/search/totalPaymentsByAccountSearchParams";
import type { TotalPaymentsByAccountGatewayDTO } from "~/domain/gateways/totalPaymentsByAccount";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  accountId: number;
  startDate?: string;
  endDate?: string;
  dateType?: string;
};

class GetTotalPaymentsByAccountUseCase {
  constructor(private gateway: TotalPaymentsByAccountGatewayDTO) {}

  async execute(input: InputProps) {
    const { accountId, startDate, endDate, dateType } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new TotalPaymentsByAccountSearchParams({
      filter: {
        account_reference_2: accountId,
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
        date_type: dateType ?? "donation",
      },
    });

    return this.gateway.getTotalPaymentsByAccount(searchParams);
  }
}

export { GetTotalPaymentsByAccountUseCase };
