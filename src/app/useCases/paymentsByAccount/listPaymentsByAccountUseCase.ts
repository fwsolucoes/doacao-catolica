import { PaymentsByAccountSearchParams } from "~/app/search/paymentsByAccountSearchParams";
import type { PaymentsByAccountGatewayDTO } from "~/domain/gateways/paymentsByAccount";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  accountId: number;
  page?: number;
  startDate?: string;
  endDate?: string;
  dateType?: string;
  origin?: string;
  paymentType?: string;
  status?: string;
  notifiedEmail?: string;
  notifiedWhatsapp?: string;
  search?: string;
  customerReference?: string;
};

class ListPaymentsByAccountUseCase {
  constructor(private gateway: PaymentsByAccountGatewayDTO) {}

  async execute(input: InputProps) {
    const { accountId, page, startDate, endDate, ...filters } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new PaymentsByAccountSearchParams({
      page: page ?? 1,
      filter: {
        account_reference_2: accountId,
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
        per_page: 20,
        date_type: filters.dateType,
        origin: filters.origin,
        type: filters.paymentType,
        status: filters.status,
        notified_email: filters.notifiedEmail,
        notified_whatsapp: filters.notifiedWhatsapp,
        search: filters.search,
        customer_reference: filters.customerReference,
      },
    });

    const result = await this.gateway.listPaymentsByAccount(searchParams);
    return result.toJson();
  }
}

export { ListPaymentsByAccountUseCase };
