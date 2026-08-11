import { DonationsSummary } from "~/domain/entities/donationsSummary";
import type { DonationsSummaryGatewayDTO } from "~/domain/gateways/donationsSummary";
import type { DonationsSummarySearchParams } from "~/app/search/donationsSummarySearchParams";
import type { DonationsSummaryJson } from "~/domain/entities/donationsSummary";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalDonationsSummarySchema } from "../schemas/external/donationsSummary";

class DonationsSummaryGateway implements DonationsSummaryGatewayDTO {
  async getDonationsSummary(
    campaignId: string,
    searchParams: DonationsSummarySearchParams,
  ): Promise<DonationsSummaryJson> {
    let url = `/api/metrics/donations-summary/${campaignId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalDonationsSummarySchema,
    ).validate(apiResponse.response);

    const s = data.data.subscriptions;

    return DonationsSummary.restore({
      averageTicketPeriod: data.data.average_ticket.period,
      averageTicketPreviousMonth: data.data.average_ticket.previous_month,
      variationPercentage: data.data.average_ticket.variation_percentage,
      oneTimeDonationsAmount: data.data.one_time_donations.amount,
      recurringDonationsAmount: data.data.recurring_donations.amount,
      subscriptionsActiveCount: s.active_count,
      subscriptionsActiveAmount: s.active_amount,
      subscriptionsCreatedInPeriodActiveAmount:
        s.created_in_period_active_amount,
    }).toJson();
  }
}

export { DonationsSummaryGateway };
