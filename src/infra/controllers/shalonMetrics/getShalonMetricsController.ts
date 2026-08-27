import type { GetShalonMetricsUseCase } from "~/app/useCases/shalonMetrics/getShalonMetricsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetShalonMetricsController {
  constructor(private getShalonMetricsUseCase: GetShalonMetricsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getShalonMetricsUseCase.execute({
      campaignPublicId: campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetShalonMetricsController };
