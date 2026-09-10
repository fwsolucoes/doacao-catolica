import type { PaymentsByAccountSearchParams } from "~/app/search/paymentsByAccountSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { Payment } from "~/domain/entities/payment";
import type { PaymentsByAccountGatewayDTO } from "~/domain/gateways/paymentsByAccount";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalPaymentsByAccountSchema } from "../schemas/external/paymentsByAccount";

class PaymentsByAccountGateway implements PaymentsByAccountGatewayDTO {
  async listPaymentsByAccount(
    searchParams: PaymentsByAccountSearchParams,
  ): Promise<SearchResult<Payment>> {
    let url = "/api/metrics/payments-by-account";
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalPaymentsByAccountSchema,
    ).validate(apiResponse.response.data);

    return new SearchResult({
      data: data.data.map((item) =>
        Payment.restore({
          id: item.payment_uuid,
          customerName: item.customer?.name ?? "",
          customerDocument: item.customer?.cpf_cnpj ?? null,
          customerEmail: item.customer?.email ?? null,
          customerPhone: item.customer?.phone ?? null,
          amount: item.amount,
          status: item.payment_status,
          origin: item.payment_origin,
          paymentType: item.payment_type,
          dueDate: item.payment_due_date,
          paidDate: item.payment_paid_date,
          confirmedDate: item.payment_confirmed_date,
          notifiedByEmail: item.notifications.some(
            (n) => n.channel === "email" && n.notified === 1,
          ),
          notifiedByWhatsApp: item.notifications.some(
            (n) => n.channel === "whatsapp" && n.notified === 1,
          ),
          notificationsCount: item.notifications.reduce(
            (acc, n) => acc + n.notified,
            0,
          ),
          paymentLink: `${environmentVariables.SANCTON_DONATION_CHECKOUT_URL}/pay/${item.payment_uuid}`,
          alertMessage: null,
          subscriptionHasToken: item.subscription_has_token,
          pixAuthorizationStatus: item.pix_authorization_status,
          operatorReference: item.operator_reference,
          campaignName: item.account_name,
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

export { PaymentsByAccountGateway };
