import type {
  GenerateUpcomingPaymentsInput,
  UpcomingPaymentGatewayDTO,
} from "~/domain/gateways/upcomingPayment";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { donationApi } from "../http/donationApi";

class UpcomingPaymentGateway implements UpcomingPaymentGatewayDTO {
  async generateUpcomingPayments(
    input: GenerateUpcomingPaymentsInput,
  ): Promise<void> {
    const headers = { "api-key": environmentVariables.API_KEY_DONATION };

    const body = {
      account_reference: input.accountReference,
      subscription_uuid: input.subscriptionUuid,
      start_date: input.startDate,
      end_date: input.endDate,
    };

    const apiResponse = await donationApi.post("/api/subscriptions/payments", {
      body,
      headers,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { UpcomingPaymentGateway };
