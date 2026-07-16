import type { TransferSearchParams } from "~/app/search/transferSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { Transfer } from "~/domain/entities/transfer";
import type {
  TransferGatewayDTO,
  TransferMetricsData,
} from "~/domain/gateways/transfer";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import {
  externalTransferMetricsSchema,
  externalTransfersSchema,
} from "../schemas/external/transfer";

class TransferGateway implements TransferGatewayDTO {
  async getTransferMetrics(
    campaignPublicId: string,
  ): Promise<TransferMetricsData> {
    const apiResponse = await donationApi.get(
      `/api/metrics/total-withdraws/${campaignPublicId}`,
      {
        headers: { "api-key": environmentVariables.API_KEY_DONATION },
      },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(
      externalTransferMetricsSchema,
    );
    const data = schemaValidator.validate(apiResponse.response);

    return {
      totalReceived: data.data.total_received,
      balanceAvailable: data.data.balance_available,
      withdrawalsMade: data.data.withdrawals_made,
    };
  }

  async listTransfers(
    campaignPublicId: string,
    searchParams: TransferSearchParams,
  ): Promise<SearchResult<Transfer>> {
    let url = `/api/withdraws/${campaignPublicId}`;
    const query = searchParams.toExternal(["page", "pageLimit"]);
    url += query === "?" ? "" : query;

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const schemaValidator = new SchemaValidatorAdapter(externalTransfersSchema);
    const data = schemaValidator.validate(apiResponse.response);

    return new SearchResult({
      data: data.data.data.map((item) =>
        Transfer.restore({
          id: item.uuid,
          status: item.status,
          type: item.type,
          paidDate: item.paid_date,
          amount: item.amount,
          createdAt: item.created_at2,
          updatedAt: item.updated_at2,
          deletedAt: item.deleted_at2,
        }),
      ),
      meta: {
        page: data.data.current_page,
        pageLimit: data.data.last_page,
        totalItems: data.data.total,
      },
    });
  }
}

export { TransferGateway };
