import type { TotalPaymentsByAccountSearchParams } from "~/app/search/totalPaymentsByAccountSearchParams";
import { TotalPaymentsByAccount } from "~/domain/entities/totalPaymentsByAccount";
import type { TotalPaymentsByAccountGatewayDTO } from "~/domain/gateways/totalPaymentsByAccount";
import type { TotalPaymentsByAccountJson } from "~/domain/entities/totalPaymentsByAccount";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalTotalPaymentsByAccountSchema } from "../schemas/external/totalPaymentsByAccount";

class TotalPaymentsByAccountGateway implements TotalPaymentsByAccountGatewayDTO {
  async getTotalPaymentsByAccount(
    searchParams: TotalPaymentsByAccountSearchParams,
  ): Promise<TotalPaymentsByAccountJson> {
    let url = "/api/metrics/total-payments-by-account";
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalTotalPaymentsByAccountSchema,
    ).validate(apiResponse.response);

    const byStatus = data.data.total_by_status;
    const subscriptions = data.data.details.subscriptions;
    const transfers = data.data.details.transfers;

    return TotalPaymentsByAccount.restore({
      releasedAmount:
        byStatus.received.amount +
        byStatus.confirmed.amount +
        byStatus.manual.amount,
      receivedOnlineAmount:
        subscriptions.received.amount + subscriptions.confirmed.amount,
      receivedOfflineAmount:
        transfers.received.amount +
        transfers.confirmed.amount +
        transfers.manual.amount,
      awaitingPaymentAmount: byStatus.awaiting_payment.amount,
      overdueAmount: byStatus.overdue.amount,
      canceledAmount: byStatus.canceled.amount,
      feeAmount: data.data.total.fee_amount,
    }).toJson();
  }
}

export { TotalPaymentsByAccountGateway };
