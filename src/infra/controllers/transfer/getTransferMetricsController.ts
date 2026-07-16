import type { GetTransferMetricsUseCase } from "~/app/useCases/transfer/getTransferMetricsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetTransferMetricsController {
  constructor(private getTransferMetricsUseCase: GetTransferMetricsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getTransferMetricsUseCase.execute({
      campaignPublicId: campaignId,
    });
  }
}

export { GetTransferMetricsController };
