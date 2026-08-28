import type { ListActiveFundraisersUseCase } from "~/app/useCases/fundraiser/listActiveFundraisersUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { SearchParamsMapper } from "~/app/shared/searchParamsMapper";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class ListActiveFundraisersController {
  constructor(private listActiveFundraisersUseCase: ListActiveFundraisersUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const scopedParams = SearchParamsMapper.toObject({
      query: route.query,
      params: route.params,
      scoped: "ambassadors",
    });

    const page = scopedParams.page ? Number(scopedParams.page) : 1;

    return await this.listActiveFundraisersUseCase.execute(
      { campaignId, page, search: scopedParams.search },
      user.token,
    );
  }
}

export { ListActiveFundraisersController };
