import type { GetCampaignPreferencesUseCase } from "~/app/useCases/campaign/getCampaignPreferencesUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetCampaignPreferencesController {
  constructor(
    private getCampaignPreferencesUseCase: GetCampaignPreferencesUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getCampaignPreferencesUseCase.execute({
      campaignId,
      token: user.token,
    });
  }
}

export { GetCampaignPreferencesController };
