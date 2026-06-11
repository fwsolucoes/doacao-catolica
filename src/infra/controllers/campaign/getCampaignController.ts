import type { GetCampaignUseCase } from "~/app/useCases/campaign/getCampaignUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetCampaignController {
  constructor(private getCampaignUseCase: GetCampaignUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getCampaignUseCase.execute({
      id: campaignId,
      token: user.token,
    });
  }
}

export { GetCampaignController };
