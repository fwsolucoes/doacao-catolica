import { PixAuthorizationSummary } from "~/domain/entities/pixAuthorizationSummary";
import type { PixAuthorizationSummaryJson } from "~/domain/entities/pixAuthorizationSummary";
import type { PixAuthorizationSummaryGatewayDTO } from "~/domain/gateways/pixAuthorizationSummary";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalPixAuthorizationSummarySchema } from "../schemas/external/pixAuthorizationSummary";

class PixAuthorizationSummaryGateway implements PixAuthorizationSummaryGatewayDTO {
  async getSummary(accountUuid: string): Promise<PixAuthorizationSummaryJson> {
    const url = `/api/pix_authorizations/summary/${accountUuid}`;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalPixAuthorizationSummarySchema,
    ).validate(apiResponse.response);

    return PixAuthorizationSummary.restore({
      active: data.data.active,
      awaitingAuthorization: data.data.awaiting_authorization,
      refused: data.data.refused,
      cancelled: data.data.cancelled,
    }).toJson();
  }
}

export { PixAuthorizationSummaryGateway };
