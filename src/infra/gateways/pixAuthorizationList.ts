import type { PixAuthorizationSearchParams } from "~/app/search/pixAuthorizationSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { PixAuthorization } from "~/domain/entities/pixAuthorization";
import type { PixAuthorizationListGatewayDTO } from "~/domain/gateways/pixAuthorizationList";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalPixAuthorizationListSchema } from "../schemas/external/pixAuthorizationList";

class PixAuthorizationListGateway implements PixAuthorizationListGatewayDTO {
  async listPixAuthorizations(
    accountUuid: string,
    searchParams: PixAuthorizationSearchParams,
  ): Promise<SearchResult<PixAuthorization>> {
    let url = `/api/pix_authorizations/list/${accountUuid}`;
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const { data } = new SchemaValidatorAdapter(
      externalPixAuthorizationListSchema,
    ).validate(apiResponse.response);

    return new SearchResult({
      data: data.data.map((item) =>
        PixAuthorization.restore({
          authorizationUuid: item.authorization_uuid,
          subscriptionUuid: item.subscription.uuid,
          status: item.status,
          statusLabel: item.status_label,
          statusUpdatedAt: item.status_updated_at,
          authorizationCreatedAt: item.authorization_created_at,
          authorizationsCount: item.authorizations_count,
          customerName: item.customer.name,
          customerPhone: item.customer.phone,
          customerCpfCnpj: item.customer.cpf_cnpj,
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

export { PixAuthorizationListGateway };
