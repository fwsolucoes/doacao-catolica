import { SearchResult } from "~/app/shared/searchResult";
import { SubAccount } from "~/domain/entities/subAccount";
import type { SubAccountGatewayDTO } from "~/domain/gateways/subAccount";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { externalSubAccountsSchema } from "../schemas/external/subAccount";

class SubAccountGateway implements SubAccountGatewayDTO {
  async listSubAccounts(
    accountId: number,
    token: string,
  ): Promise<SearchResult<SubAccount>> {
    const apiResponse = await api.get(`/payment/subaccounts/${accountId}`, {
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalSubAccountsSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: data.data.map((item) =>
        SubAccount.restore({
          subAccountId: item.subaccount_id,
          accountId: item.account_id,
          name: item.name,
          email: item.email,
          loginEmail: item.login_email,
          phone: item.phone,
          mobilePhone: item.mobile_phone,
          address: item.address,
          addressNumber: item.address_number,
          complement: item.complement,
          province: item.province,
          postalCode: item.postal_code,
          cpfCnpj: item.cpf_cnpj,
          birthDate: item.birth_date,
          personType: item.person_type,
          companyType: item.company_type,
          city: item.city,
          state: item.state,
          country: item.country,
          tradingName: item.trading_name,
          site: item.site,
          incomeRange: item.income_range,
          gatewayId: item.gateway_id,
          apiKey: item.api_key,
          walletId: item.wallet_id,
          gatewayStatus: item.gateway_status,
          lastSyncDate: item.last_sync_date,
          responseStatus: item.response_status,
          dioceseId: item.diocese_id,
          institutionName: item.institution_name,
          domainOrigin: item.domain_origin,
          institutionTypeId: item.institution_type_id,
          institutionPhone: item.institution_phone,
          institutionDescription: item.institution_description,
          instagramProfile: item.instagram_profile,
          facebookProfile: item.facebook_profile,
          adminComments: item.admin_comments,
          adminIsApproved: item.admin_is_approved,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }),
      ),
      meta: {
        page: data.meta.current_page,
        pageLimit: data.meta.items_per_page,
        totalItems: data.meta.total_items,
      },
    });
  }
}

export { SubAccountGateway };
