import { ListPaymentsByAccountUseCase } from "~/app/useCases/paymentsByAccount/listPaymentsByAccountUseCase";
import { PaymentsByAccountGateway } from "~/infra/gateways/paymentsByAccount";

const paymentsByAccountGateway = new PaymentsByAccountGateway();
const listPaymentsByAccountUseCase = new ListPaymentsByAccountUseCase(
  paymentsByAccountGateway,
);

const listPaymentsByAccount = {
  handle: (accountId: number, query: Record<string, string>) =>
    listPaymentsByAccountUseCase.execute({
      accountId,
      page: query.page ? Number(query.page) : undefined,
      startDate: query.start_date,
      endDate: query.end_date,
      dateType: query.date_type,
      origin: query.origin,
      paymentType: query.type,
      status: query.status,
      notifiedEmail: query.notified_email,
      notifiedWhatsapp: query.notified_whatsapp,
      search: query.search,
      customerReference: query.customer_reference,
      accountReference: query.account_reference,
    }),
};

export { listPaymentsByAccount };
