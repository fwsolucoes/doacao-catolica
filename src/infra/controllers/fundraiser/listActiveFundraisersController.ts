import type { ListActiveFundraisersUseCase } from "~/app/useCases/fundraiser/listActiveFundraisersUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListActiveFundraisersController {
  constructor(private listActiveFundraisersUseCase: ListActiveFundraisersUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listActiveFundraisersUseCase.execute(
      { campaignId, page },
      user.token,
    );
  }
}

export { ListActiveFundraisersController };
