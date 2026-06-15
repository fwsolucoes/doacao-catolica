import type { GetPaymentMetricsUseCase } from "~/app/useCases/paymentMetrics/getPaymentMetricsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetPaymentMetricsController {
  constructor(private getPaymentMetricsUseCase: GetPaymentMetricsUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.getPaymentMetricsUseCase.execute({
      subAccountId: campaignId,
      token: user.token,
    });
  }
}

export { GetPaymentMetricsController };
