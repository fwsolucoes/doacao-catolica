import type { ListPixAuthorizationsUseCase } from "~/app/useCases/pixAuthorizationList/listPixAuthorizationsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListPixAuthorizationsController {
  constructor(private useCase: ListPixAuthorizationsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.useCase.execute({
      accountUuid: campaignId,
      page,
      status: route.query.status,
      search: route.query.search,
      order: route.query.order,
    });
  }
}

export { ListPixAuthorizationsController };
