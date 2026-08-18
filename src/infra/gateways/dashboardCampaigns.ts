import type { DashboardCampaignsSearchParams } from "~/app/search/dashboardCampaignsSearchParams";
import type {
  DashboardCampaignsData,
  DashboardCampaignsGatewayDTO,
} from "~/domain/gateways/dashboardCampaigns";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalDashboardCampaignsSchema } from "../schemas/external/dashboardCampaigns";

class DashboardCampaignsGateway implements DashboardCampaignsGatewayDTO {
  async getCampaigns(
    accountUuid: string,
    searchParams: DashboardCampaignsSearchParams,
  ): Promise<DashboardCampaignsData> {
    let url = `/api/dashboard/campaigns/${accountUuid}`;

    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalDashboardCampaignsSchema,
    ).validate(apiResponse.response);

    return {
      total: data.data.total,
      campaigns: data.data.campaigns.map((c) => ({
        accountReference: c.account_reference,
        name: c.name,
        donorsCount: c.donors_count,
        monthRaised: c.month_raised,
        totalRaised: c.total_raised,
        monthlyGoal: c.monthly_goal,
        totalGoal: c.total_goal,
        progressPercentage: c.progress_percentage,
      })),
    };
  }
}

export { DashboardCampaignsGateway };
