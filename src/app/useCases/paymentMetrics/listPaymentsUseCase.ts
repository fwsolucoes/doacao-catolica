import { PaymentMetricsSearchParams } from "~/app/search/paymentMetricsSearchParams";
import type { PaymentMetricsGatewayDTO } from "~/domain/gateways/paymentMetrics";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignPublicId: string;
  page?: number | null;
};

class ListPaymentsUseCase {
  constructor(private gateway: PaymentMetricsGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignPublicId, page } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new PaymentMetricsSearchParams({
      page: page ?? 1,
      filter: { start_date: firstDayOfMonth, end_date: lastDayOfMonth },
    });

    const result = await this.gateway.listPayments(campaignPublicId, searchParams);
    return result.toJson();
  }
}

export { ListPaymentsUseCase };
