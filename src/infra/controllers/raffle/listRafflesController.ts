import { SearchParamsMapper } from "~/app/shared/searchParamsMapper";
import type { ListRafflesUseCase } from "~/app/useCases/raffle/listRafflesUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListRafflesController {
  constructor(private listRafflesUseCase: ListRafflesUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const scopedParams = SearchParamsMapper.toObject({
      query: route.query,
      params: route.params,
      scoped: "raffles",
    });

    return await this.listRafflesUseCase.execute({
      accountReference: campaignId,
      page: scopedParams.page ? Number(scopedParams.page) : 1,
      search: scopedParams.search,
      status: scopedParams.status,
    });
  }
}

export { ListRafflesController };
