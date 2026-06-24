import type { PaymentMetricsSearchParams } from "~/app/search/paymentMetricsSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { Payment } from "~/domain/entities/payment";
import type {
  PaymentMetricsData,
  PaymentMetricsGatewayDTO,
} from "~/domain/gateways/paymentMetrics";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalPaymentMetricsSchema } from "../schemas/external/paymentMetrics";
import { externalPaymentsListSchema } from "../schemas/external/paymentsList";

class PaymentMetricsGateway implements PaymentMetricsGatewayDTO {
  async getPaymentMetrics(
    campaignPublicId: string,
    searchParams: PaymentMetricsSearchParams,
  ): Promise<PaymentMetricsData> {
    let url = `/api/metrics/total-payments/${campaignPublicId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalPaymentMetricsSchema,
    );
    const data = schemaValidator.validate(apiResponse.response.data);

    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const received = data.total_by_status.received;
    const confirmed = data.total_by_status.confirmed;
    const awaitingPayment = data.total_by_status.awaiting_payment;
    const manual = data.total_by_status.manual;
    const overdue = data.total_by_status.overdue;
    const canceled = data.total_by_status.canceled;

    return {
      receivedOnline: fmt(received.amount + confirmed.amount),
      released: fmt(received.amount),
      awaitingRelease: fmt(confirmed.amount),
      pending: fmt(awaitingPayment.amount + overdue.amount),
      receivedOffline: fmt(manual.amount),
      overdue: fmt(overdue.amount),
      canceled: fmt(canceled.amount),
      appliedFees: fmt(received.fee_amount + confirmed.fee_amount),
    };
  }

  async listPayments(
    campaignPublicId: string,
    searchParams: PaymentMetricsSearchParams,
  ): Promise<SearchResult<Payment>> {
    let url = `/api/metrics/payments/${campaignPublicId}`;
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(externalPaymentsListSchema);
    const data = schemaValidator.validate(apiResponse.response.data);

    return new SearchResult({
      data: data.data.map((item) =>
        Payment.restore({
          id: item.payment_uuid,
          customerName: item.customer.name,
          amount: item.amount,
          status: item.payment_status,
          origin: item.payment_origin,
          paymentType: item.payment_type,
          dueDate: item.payment_due_date,
          paidDate: item.payment_paid_date,
          confirmedDate: item.payment_confirmed_date,
        }),
      ),
      meta: {
        page: data.current_page,
        pageLimit: data.per_page,
        totalItems: data.total,
      },
    });
  }
}

export { PaymentMetricsGateway };
