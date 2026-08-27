import { FinancialSummary } from "~/domain/entities/financialSummary";
import type { FinancialSummaryGatewayDTO } from "~/domain/gateways/financialSummary";
import type { FinancialSummarySearchParams } from "~/app/search/financialSummarySearchParams";
import type { FinancialSummaryJson } from "~/domain/entities/financialSummary";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { webworkerApi } from "../http/webworkerApi";
import { externalFinancialSummarySchema } from "../schemas/external/financialSummary";

class FinancialSummaryGateway implements FinancialSummaryGatewayDTO {
  async getFinancialSummary(
    referenceId: string,
    searchParams: FinancialSummarySearchParams,
  ): Promise<FinancialSummaryJson> {
    let url = `/donation/financial-summary/${referenceId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await webworkerApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalFinancialSummarySchema,
    ).validate(apiResponse.response);

    const s = data.data.summary;

    return FinancialSummary.restore({
      totalRaisedAmount: s.total_raised_amount,
      onlineAmount: s.online_amount,
      offlineAmount: s.offline_amount,
      availableBalance: s.available_balance,
      averageTicket: s.average_ticket,
      totalPaidPayments: s.total_paid_payments,
      totalCampaigns: s.total_campaigns,
      campaigns: data.data.campaigns.map((c) => ({
        id: c.id,
        uuid: c.uuid,
        name: c.name,
        status: c.status,
        totalRaisedAmount: c.total_raised_amount,
        onlineAmount: c.online_amount,
        offlineAmount: c.offline_amount,
        availableBalance: c.available_balance,
        averageTicket: c.average_ticket,
        totalPaidPayments: c.total_paid_payments,
      })),
    }).toJson();
  }
}

export { FinancialSummaryGateway };
