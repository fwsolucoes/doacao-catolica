import type { ListEmailTemplatesUseCase } from "~/app/useCases/campaign/listEmailTemplatesUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListEmailTemplatesController {
  constructor(private listEmailTemplatesUseCase: ListEmailTemplatesUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.listEmailTemplatesUseCase.execute({ campaignId });
  }
}

export { ListEmailTemplatesController };
