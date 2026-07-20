import type { CampaignRecurrenceSearchParams } from "~/app/search/campaignRecurrenceSearchParams";
import type {
  CampaignRecurrenceData,
  CampaignRecurrenceGatewayDTO,
} from "~/domain/gateways/campaignRecurrence";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalCampaignRecurrenceSchema } from "../schemas/external/campaignRecurrence";

class CampaignRecurrenceGateway implements CampaignRecurrenceGatewayDTO {
  async getRecurrence(
    campaignId: string,
    searchParams: CampaignRecurrenceSearchParams,
  ): Promise<CampaignRecurrenceData> {
    let url = `/api/campaign/recurrence/${campaignId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalCampaignRecurrenceSchema,
    ).validate(apiResponse.response);

    return {
      months: data.data.months.map((m) => ({
        month: m.month,
        label: m.label,
        activeSubscriptions: m.active_subscriptions,
        recurringDonations: m.recurring_donations,
        recurringAmount: m.recurring_amount,
      })),
    };
  }
}

export { CampaignRecurrenceGateway };
