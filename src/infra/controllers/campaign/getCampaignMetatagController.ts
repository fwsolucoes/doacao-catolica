import type { GetCampaignMetatagUseCase } from "~/app/useCases/campaign/getCampaignMetatagUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetCampaignMetatagController {
  constructor(private getCampaignMetatagUseCase: GetCampaignMetatagUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getCampaignMetatagUseCase.execute({
      campaignId,
      token: user.token,
    });
  }
}

export { GetCampaignMetatagController };
