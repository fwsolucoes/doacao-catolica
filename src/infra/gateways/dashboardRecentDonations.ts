import type { DashboardRecentDonationsSearchParams } from "~/app/search/dashboardRecentDonationsSearchParams";
import type {
  DashboardRecentDonationsData,
  DashboardRecentDonationsGatewayDTO,
} from "~/domain/gateways/dashboardRecentDonations";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalDashboardRecentDonationsSchema } from "../schemas/external/dashboardRecentDonations";

class DashboardRecentDonationsGateway
  implements DashboardRecentDonationsGatewayDTO
{
  async getRecentDonations(
    accountUuid: string,
    searchParams: DashboardRecentDonationsSearchParams,
  ): Promise<DashboardRecentDonationsData> {
    let url = `/api/dashboard/recent-donations/${accountUuid}`;

    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalDashboardRecentDonationsSchema,
    ).validate(apiResponse.response);

    return {
      recentDonations: data.data.recent_donations.map((d) => ({
        paymentUuid: d.payment_uuid,
        customerName: d.customer_name,
        customerReference: d.customer_reference,
        customerInitials: d.customer_initials,
        campaignName: d.campaign_name,
        accountReference: d.account_reference,
        paymentMethod: d.payment_method,
        status: d.status,
        origin: d.origin,
        amount: d.amount,
        paidAt: d.paid_at,
        elapsed: d.elapsed,
      })),
    };
  }
}

export { DashboardRecentDonationsGateway };
