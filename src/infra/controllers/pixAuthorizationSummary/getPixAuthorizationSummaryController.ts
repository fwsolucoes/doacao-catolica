import type { GetPixAuthorizationSummaryUseCase } from "~/app/useCases/pixAuthorizationSummary/getPixAuthorizationSummaryUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetPixAuthorizationSummaryController {
  constructor(private useCase: GetPixAuthorizationSummaryUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.useCase.execute({ accountUuid: campaignId });
  }
}

export { GetPixAuthorizationSummaryController };
