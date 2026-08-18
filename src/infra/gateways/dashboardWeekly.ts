import type { DashboardWeeklySearchParams } from "~/app/search/dashboardWeeklySearchParams";
import type {
  DashboardWeeklyData,
  DashboardWeeklyGatewayDTO,
} from "~/domain/gateways/dashboardWeekly";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalDashboardWeeklySchema } from "../schemas/external/dashboardWeekly";

class DashboardWeeklyGateway implements DashboardWeeklyGatewayDTO {
  async getWeekly(
    accountUuid: string,
    searchParams: DashboardWeeklySearchParams,
  ): Promise<DashboardWeeklyData> {
    let url = `/api/dashboard/weekly/${accountUuid}`;

    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalDashboardWeeklySchema,
    ).validate(apiResponse.response);

    return {
      startDate: data.data.start_date,
      endDate: data.data.end_date,
      totalAmount: data.data.total_amount,
      donationsCount: data.data.donations_count,
      previousWeekAmount: data.data.previous_week_amount,
      growthPercentage: data.data.growth_percentage,
      days: data.data.days.map((d) => ({
        date: d.date,
        dayOfWeek: d.day_of_week,
        label: d.label,
        donationsCount: d.donations_count,
        totalAmount: d.total_amount,
      })),
    };
  }
}

export { DashboardWeeklyGateway };
