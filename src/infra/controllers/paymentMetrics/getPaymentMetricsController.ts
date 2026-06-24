import type { GetPaymentMetricsUseCase } from "~/app/useCases/paymentMetrics/getPaymentMetricsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetPaymentMetricsController {
  constructor(private getPaymentMetricsUseCase: GetPaymentMetricsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getPaymentMetricsUseCase.execute({
      campaignPublicId: campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetPaymentMetricsController };
