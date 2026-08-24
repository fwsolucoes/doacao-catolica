import { PixAuthorizationHistory } from "~/domain/entities/pixAuthorizationHistory";
import type { PixAuthorizationHistoryJson } from "~/domain/entities/pixAuthorizationHistory";
import type { PixAuthorizationHistoryGatewayDTO } from "~/domain/gateways/pixAuthorizationHistory";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalPixAuthorizationHistorySchema } from "../schemas/external/pixAuthorizationHistory";

class PixAuthorizationHistoryGateway implements PixAuthorizationHistoryGatewayDTO {
  async getHistory(
    subscriptionUuid: string,
  ): Promise<PixAuthorizationHistoryJson> {
    const url = `/api/pix_authorizations/history/${subscriptionUuid}`;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const { data } = new SchemaValidatorAdapter(
      externalPixAuthorizationHistorySchema,
    ).validate(apiResponse.response);

    return PixAuthorizationHistory.restore({
      customerName: data.customer.name,
      subscriptionName: data.subscription.name,
      authorizations: data.authorizations.map((a) => ({
        authorizationUuid: a.authorization_uuid,
        status: a.status,
        statusLabel: a.status_label,
        createdAt: a.authorization_created_at ?? "",
      })),
    }).toJson();
  }
}

export { PixAuthorizationHistoryGateway };
