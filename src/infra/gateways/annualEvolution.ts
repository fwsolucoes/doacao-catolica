import type { AnnualEvolutionSearchParams } from "~/app/search/annualEvolutionSearchParams";
import type {
  AnnualEvolutionData,
  AnnualEvolutionGatewayDTO,
} from "~/domain/gateways/annualEvolution";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalAnnualEvolutionSchema } from "../schemas/external/annualEvolution";

class AnnualEvolutionGateway implements AnnualEvolutionGatewayDTO {
  async getAnnualEvolution(
    accountUuid: string,
    searchParams: AnnualEvolutionSearchParams,
  ): Promise<AnnualEvolutionData> {
    let url = `/api/dashboard/annual-evolution/${accountUuid}`;

    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalAnnualEvolutionSchema,
    ).validate(apiResponse.response);

    return {
      year: data.data.year,
      monthlyGoal: data.data.monthly_goal,
      periodGoal: data.data.period_goal,
      totalAmount: data.data.total_amount,
      months: data.data.months.map((m) => ({
        month: m.month,
        monthKey: m.month_key,
        label: m.label,
        donationsCount: m.donations_count,
        totalAmount: m.total_amount,
        goalAmount: m.goal_amount,
        goalProgressPercentage: m.goal_progress_percentage,
      })),
    };
  }
}

export { AnnualEvolutionGateway };
