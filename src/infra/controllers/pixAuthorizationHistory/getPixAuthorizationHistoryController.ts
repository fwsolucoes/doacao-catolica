import type { GetPixAuthorizationHistoryUseCase } from "~/app/useCases/pixAuthorizationHistory/getPixAuthorizationHistoryUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetPixAuthorizationHistoryController {
  constructor(private useCase: GetPixAuthorizationHistoryUseCase) {}

  async handle(route: RouteDTO) {
    const { subscriptionUuid } = route.params;
    if (!subscriptionUuid)
      throw HttpAdapter.badRequest("subscriptionUuid is required");

    return await this.useCase.execute({ subscriptionUuid });
  }
}

export { GetPixAuthorizationHistoryController };
