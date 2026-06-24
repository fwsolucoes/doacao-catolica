import type { ListPaymentsUseCase } from "~/app/useCases/paymentMetrics/listPaymentsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListPaymentsController {
  constructor(private listPaymentsUseCase: ListPaymentsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listPaymentsUseCase.execute({
      campaignPublicId: campaignId,
      page,
    });
  }
}

export { ListPaymentsController };
