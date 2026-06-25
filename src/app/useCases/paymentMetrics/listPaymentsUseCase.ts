import { PaymentsListSearchParams } from "~/app/search/paymentsListSearchParams";
import type { PaymentMetricsGatewayDTO } from "~/domain/gateways/paymentMetrics";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignPublicId: string;
  page?: number | null;
  startDate?: string;
  endDate?: string;
  dateType?: string;
  origin?: string;
  paymentType?: string;
  status?: string;
  notifiedEmail?: string;
  notifiedWhatsapp?: string;
};

class ListPaymentsUseCase {
  constructor(private gateway: PaymentMetricsGatewayDTO) {}

  async execute(input: InputProps) {
    const {
      campaignPublicId,
      page,
      startDate,
      endDate,
      dateType,
      origin,
      paymentType,
      status,
      notifiedEmail,
      notifiedWhatsapp,
    } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new PaymentsListSearchParams({
      page: page ?? 1,
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
        per_page: 20,
        date_type: dateType,
        origin: origin,
        type: paymentType,
        status: status,
        notified_email: notifiedEmail,
        notified_whatsapp: notifiedWhatsapp,
      },
    });

    const result = await this.gateway.listPayments(campaignPublicId, searchParams);
    return result.toJson();
  }
}

export { ListPaymentsUseCase };
