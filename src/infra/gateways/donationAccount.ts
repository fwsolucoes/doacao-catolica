import type {
  DonationAccountGatewayDTO,
  UpdateDonationAccountGoalsInput,
} from "~/domain/gateways/donationAccount";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { donationApi } from "../http/donationApi";

class DonationAccountGateway implements DonationAccountGatewayDTO {
  async updateGoals(
    accountUuid: string,
    input: UpdateDonationAccountGoalsInput,
  ): Promise<void> {
    const apiResponse = await donationApi.put(`/api/accounts/${accountUuid}`, {
      body: {
        total_goal: input.totalGoal,
        monthly_goal: input.monthlyGoal,
      },
      headers: { "api-key": environmentVariables.API_KEY_DONATION },
    });

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }
}

export { DonationAccountGateway };
