import type { ListFundraisersUseCase } from "~/app/useCases/fundraiser/listFundraisersUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListFundraisersController {
  constructor(private listFundraisersUseCase: ListFundraisersUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.listFundraisersUseCase.execute({ campaignId }, user.token);
  }
}

export { ListFundraisersController };
