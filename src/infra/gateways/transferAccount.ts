import { SearchResult } from "~/app/shared/searchResult";
import { TransferAccount } from "~/domain/entities/transferAccount";
import type {
  CreateTransferAccountInput,
  RequestWithdrawalInput,
  TransferAccountGatewayDTO,
} from "~/domain/gateways/transferAccount";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { api } from "../http/api";
import { donationApi } from "../http/donationApi";
import { externalTransferAccountsSchema } from "../schemas/external/transferAccount";

class TransferAccountGateway implements TransferAccountGatewayDTO {
  async createTransferAccount(input: CreateTransferAccountInput): Promise<void> {
    const url = `/${environmentVariables.API_DATABASE}/${input.accountId}/bank_accounts`;

    const apiResponse = await api.post(url, {
      body: {
        pixType: input.pixType,
        pixKey: input.pixKey,
        type: input.type,
      },
      token: input.token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async listTransferAccounts(
    accountId: number,
    token: string,
  ): Promise<SearchResult<TransferAccount>> {
    const params = new URLSearchParams();
    params.set("filter[account_id]", String(accountId));

    const apiResponse = await api.get(`/bank-accounts/list?${params.toString()}`, {
      token,
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalTransferAccountsSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: data.items.map((item) =>
        TransferAccount.restore({
          id: item.id,
          accountId: item.account_id,
          type: item.type,
          name: item.name ?? null,
          cpfCnpj: item.cpf_cnpj,
          documentUrl: item.document_url ?? null,
          pixKey: item.pix_key,
          pixType: item.pix_type,
          agency: item.agency,
          responsibleBirthday: item.responsible_birthday ?? null,
          responsibleName: item.responsible_name ?? null,
          responsiblePhone: item.responsible_phone ?? null,
          bank: item.bank,
          bankAccount: item.bank_account,
          bankAccountType: item.bank_account_type,
          createdAt: item.created_at ?? null,
          updatedAt: item.updated_at ?? null,
          deletedAt: item.deleted_at ?? null,
        }),
      ),
      meta: {
        page: data.current_page,
        pageLimit: data.per_page,
        totalItems: data.total,
      },
    });
  }

  async requestWithdrawal(input: RequestWithdrawalInput): Promise<void> {
    const apiResponse = await donationApi.post("/api/withdraws", {
      body: {
        account_uuid: input.accountUuid,
        type: "pix",
        amount: input.amount,
        pix: {
          key: input.pix.key,
          type: input.pix.type,
          schedule_date: input.pix.scheduleDate,
        },
      },
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { TransferAccountGateway };
