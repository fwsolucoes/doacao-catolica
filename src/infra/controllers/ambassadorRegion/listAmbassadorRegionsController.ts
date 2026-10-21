import type { ListAmbassadorRegionsUseCase } from "~/app/useCases/ambassadorRegion/listAmbassadorRegionsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListAmbassadorRegionsController {
  constructor(private useCase: ListAmbassadorRegionsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.useCase.execute(campaignId);
  }
}

export { ListAmbassadorRegionsController };
