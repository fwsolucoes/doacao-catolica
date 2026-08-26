import type { GetCampaignUseCase } from "~/app/useCases/campaign/getCampaignUseCase";
import type { ListTransferAccountsUseCase } from "~/app/useCases/transferAccount/listTransferAccountsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListTransferAccountsController {
  constructor(
    private listTransferAccountsUseCase: ListTransferAccountsUseCase,
    private getCampaignUseCase: GetCampaignUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const campaign = await this.getCampaignUseCase.execute({
      id: campaignId,
      token: user.token,
    });

    return await this.listTransferAccountsUseCase.execute(
      { accountId: campaign.accountId },
      user.token,
    );
  }
}

export { ListTransferAccountsController };
