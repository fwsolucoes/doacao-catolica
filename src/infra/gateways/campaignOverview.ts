import type { CampaignOverviewSearchParams } from "~/app/search/campaignOverviewSearchParams";
import type {
  CampaignOverviewData,
  CampaignOverviewGatewayDTO,
} from "~/domain/gateways/campaignOverview";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalCampaignOverviewSchema } from "../schemas/external/campaignOverview";

class CampaignOverviewGateway implements CampaignOverviewGatewayDTO {
  async getOverview(
    campaignId: string,
    searchParams: CampaignOverviewSearchParams,
  ): Promise<CampaignOverviewData> {
    let url = `/api/campaign/overview/${campaignId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalCampaignOverviewSchema,
    ).validate(apiResponse.response);

    return {
      totalRaised: data.data.total_raised,
      monthRaised: data.data.month_raised,
      previousMonthRaised: data.data.previous_month_raised,
      growthPercentage: data.data.growth_percentage,
      monthlyGoal: data.data.monthly_goal,
      totalGoal: data.data.total_goal,
      totalGoalProgressPercentage: data.data.total_goal_progress_percentage,
      monthlyGoalProgressPercentage: data.data.monthly_goal_progress_percentage,
      totalGoalRemaining: data.data.total_goal_remaining,
      monthlyGoalRemaining: data.data.monthly_goal_remaining,
      supporters: data.data.supporters,
      newSupportersLast7Days: data.data.new_supporters_last_7_days,
      averageTicketMonth: data.data.average_ticket_month,
      averageTicketPreviousMonth: data.data.average_ticket_previous_month,
      averageTicketVariationPercentage:
        data.data.average_ticket_variation_percentage,
      oneTimeCustomers: data.data.one_time_customers,
      recurringCustomers: data.data.recurring_customers,
    };
  }
}

export { CampaignOverviewGateway };
