import type { ListDonorsByCampaignUseCase } from "~/app/useCases/donor/listDonorsByCampaignUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListDonorsByCampaignController {
  constructor(
    private listDonorsByCampaignUseCase: ListDonorsByCampaignUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listDonorsByCampaignUseCase.execute({
      campaignId,
      page,
      search: route.query.donor_search,
      token: user.token,
    });
  }
}

export { ListDonorsByCampaignController };
