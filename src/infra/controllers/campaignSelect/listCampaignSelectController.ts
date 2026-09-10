import type { ListCampaignSelectUseCase } from "~/app/useCases/campaignSelect/listCampaignSelectUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListCampaignSelectController {
  constructor(private listCampaignSelectUseCase: ListCampaignSelectUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return await this.listCampaignSelectUseCase.execute(user.token);
  }
}

export { ListCampaignSelectController };
