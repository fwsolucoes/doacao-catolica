import { PaymentMetricsSearchParams } from "~/app/search/paymentMetricsSearchParams";
import type {
  PaymentMetricsData,
  PaymentMetricsGatewayDTO,
} from "~/domain/gateways/paymentMetrics";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignPublicId: string;
  startDate?: string;
  endDate?: string;
};

class GetPaymentMetricsUseCase {
  constructor(private paymentMetricsGateway: PaymentMetricsGatewayDTO) {}

  async execute(input: InputProps): Promise<PaymentMetricsData> {
    const { campaignPublicId, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new PaymentMetricsSearchParams({
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
      },
    });

    return this.paymentMetricsGateway.getPaymentMetrics(
      campaignPublicId,
      searchParams,
    );
  }
}

export { GetPaymentMetricsUseCase };
