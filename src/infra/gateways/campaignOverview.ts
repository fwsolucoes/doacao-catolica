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

    if (!apiResponse.response) {
      return {
        totalRaised: 0,
        monthRaised: 0,
        previousMonthRaised: 0,
        growthPercentage: null,
        monthlyGoal: null,
        totalGoal: null,
        totalGoalProgressPercentage: null,
        monthlyGoalProgressPercentage: null,
        totalGoalRemaining: null,
        monthlyGoalRemaining: null,
        supporters: 0,
        newSupportersLast7Days: 0,
        averageTicketMonth: 0,
        averageTicketPreviousMonth: 0,
        averageTicketVariationPercentage: null,
        oneTimeCustomers: 0,
        recurringCustomers: 0,
      };
    }

    const { data } = new SchemaValidatorAdapter(
      externalCampaignOverviewSchema,
    ).validate(apiResponse.response);

    if (!data) {
      return {
        totalRaised: 0,
        monthRaised: 0,
        previousMonthRaised: 0,
        growthPercentage: null,
        monthlyGoal: null,
        totalGoal: null,
        totalGoalProgressPercentage: null,
        monthlyGoalProgressPercentage: null,
        totalGoalRemaining: null,
        monthlyGoalRemaining: null,
        supporters: 0,
        newSupportersLast7Days: 0,
        averageTicketMonth: 0,
        averageTicketPreviousMonth: 0,
        averageTicketVariationPercentage: null,
        oneTimeCustomers: 0,
        recurringCustomers: 0,
      };
    }

    return {
      totalRaised: data.total_raised,
      monthRaised: data.month_raised,
      previousMonthRaised: data.previous_month_raised,
      growthPercentage: data.growth_percentage,
      monthlyGoal: data.monthly_goal,
      totalGoal: data.total_goal,
      totalGoalProgressPercentage: data.total_goal_progress_percentage,
      monthlyGoalProgressPercentage: data.monthly_goal_progress_percentage,
      totalGoalRemaining: data.total_goal_remaining,
      monthlyGoalRemaining: data.monthly_goal_remaining,
      supporters: data.supporters,
      newSupportersLast7Days: data.new_supporters_last_7_days,
      averageTicketMonth: data.average_ticket_month,
      averageTicketPreviousMonth: data.average_ticket_previous_month,
      averageTicketVariationPercentage: data.average_ticket_variation_percentage,
      oneTimeCustomers: data.one_time_customers,
      recurringCustomers: data.recurring_customers,
    };
  }
}

export { CampaignOverviewGateway };
