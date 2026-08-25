import type { GetAmbassadorsDashboardUseCase } from "~/app/useCases/ambassadorsDashboard/getAmbassadorsDashboardUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetAmbassadorsDashboardController {
  constructor(private useCase: GetAmbassadorsDashboardUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.useCase.execute({
      campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
      page: route.query.page,
      search: route.query.search,
      name: route.query.name,
      email: route.query.email,
      phone: route.query.phone,
      status: route.query.status,
      minIndications: route.query.min_indications,
      maxIndications: route.query.max_indications,
    });
  }
}

export { GetAmbassadorsDashboardController };
