import type { ListAccountWebhooksUseCase } from "~/app/useCases/accountWebhook/listAccountWebhooksUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListAccountWebhooksController {
  constructor(private listAccountWebhooksUseCase: ListAccountWebhooksUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.listAccountWebhooksUseCase.execute(campaignId);
  }
}

export { ListAccountWebhooksController };
