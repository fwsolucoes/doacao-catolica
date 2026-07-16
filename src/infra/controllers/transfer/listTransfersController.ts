import type { ListTransfersUseCase } from "~/app/useCases/transfer/listTransfersUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListTransfersController {
  constructor(private listTransfersUseCase: ListTransfersUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.listTransfersUseCase.execute({
      campaignPublicId: campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { ListTransfersController };
