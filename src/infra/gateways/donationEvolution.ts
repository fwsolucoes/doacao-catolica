import type { DonationEvolutionSearchParams } from "~/app/search/donationEvolutionSearchParams";
import type {
  DonationEvolutionData,
  DonationEvolutionGatewayDTO,
} from "~/domain/gateways/donationEvolution";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import { externalDonationEvolutionSchema } from "../schemas/external/donationEvolution";

class DonationEvolutionGateway implements DonationEvolutionGatewayDTO {
  async getEvolution(
    campaignId: string,
    searchParams: DonationEvolutionSearchParams,
  ): Promise<DonationEvolutionData> {
    let url = `/api/campaign/evolution/${campaignId}`;
    url += searchParams.toExternal(["page", "pageLimit"]);

    const apiResponse = await donationApi.get(url, {
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(
      externalDonationEvolutionSchema,
    ).validate(apiResponse.response);

    return {
      days: data.data.days.map((d) => ({
        day: d.day,
        date: d.date,
        oneTimeAmount: d.one_time_amount,
        recurringAmount: d.recurring_amount,
        totalAmount: d.total_amount,
      })),
    };
  }
}

export { DonationEvolutionGateway };
