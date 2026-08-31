import type {
  ShalomMetricsGatewayDTO,
  ShalomMetricsData,
} from "~/domain/gateways/shalomMetrics";
import type { ShalomMetricsSearchParams } from "~/app/search/shalomMetricsSearchParams";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalPaymentMetricsSchema } from "../schemas/external/paymentMetrics";

class ShalomMetricsGateway implements ShalomMetricsGatewayDTO {
  async getShalomMetrics(
    campaignPublicId: string,
    searchParams: ShalomMetricsSearchParams,
  ): Promise<ShalomMetricsData> {
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
    const manual = data.total_by_status.manual;
    const overdue = data.total_by_status.overdue;

    const receivedOnlineTotal =
      received.amount +
      confirmed.amount +
      received.fee_amount +
      confirmed.fee_amount;
    const grandTotal = receivedOnlineTotal + manual.amount;

    return {
      receivedOnline: fmt(receivedOnlineTotal),
      receivedOnlineFee: fmt(receivedOnlineTotal * 0.24),
      totalAvailable: fmt(received.amount),
      pendingAvailability: fmt(confirmed.amount),
      receivedOffline: fmt(manual.amount),
      receivedOfflineFee: fmt(manual.amount * 0.24),
      overdue: fmt(overdue.amount),
      appliedFees: fmt(received.fee_amount + confirmed.fee_amount),
      shalomTransfers: fmt(grandTotal * 0.24),
      missionTransfers: fmt(grandTotal * 0.76),
    };
  }
}

export { ShalomMetricsGateway };
