import type { CampaignActivitySearchParams } from "~/app/search/campaignActivitySearchParams";
import type {
  CampaignActivityData,
  CampaignActivityGatewayDTO,
} from "~/domain/gateways/campaignActivity";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalCampaignActivitySchema } from "../schemas/external/campaignActivity";

class CampaignActivityGateway implements CampaignActivityGatewayDTO {
  async getActivity(
    campaignId: string,
    searchParams: CampaignActivitySearchParams,
  ): Promise<CampaignActivityData> {
    let url = `/api/campaign/activity/${campaignId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalCampaignActivitySchema,
    ).validate(apiResponse.response);

    return {
      recentDonations: data.data.recent_donations.map((d) => ({
        paymentUuid: d.payment_uuid,
        customerName: d.customer_name,
        customerReference: d.customer_reference,
        paymentMethod: d.payment_method,
        status: d.status,
        origin: d.origin,
        amount: d.amount,
        paidAt: d.paid_at,
      })),
      topDonors: data.data.top_donors.map((d) => ({
        customerUuid: d.customer_uuid,
        customerReference: d.customer_reference,
        customerName: d.customer_name,
        donationsCount: d.donations_count,
        totalAmount: d.total_amount,
      })),
    };
  }
}

export { CampaignActivityGateway };
