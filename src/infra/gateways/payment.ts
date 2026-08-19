import type { PaymentGatewayDTO } from "~/domain/gateways/payment";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { donationApi } from "../http/donationApi";

class PaymentGateway implements PaymentGatewayDTO {
  private get headers() {
    return { "api-key": environmentVariables.API_KEY_DONATION };
  }

  async cancelPayment(accountUuid: string, payments: string[]): Promise<void> {
    const apiResponse = await donationApi.delete(
      `/api/payments/delete/${accountUuid}`,
      { body: { payments }, headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { PaymentGateway };
