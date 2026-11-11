import { SearchParamsMapper } from "~/app/shared/searchParamsMapper";
import type { ListRaffleTicketsUseCase } from "~/app/useCases/raffle/listRaffleTicketsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListRaffleTicketsController {
  constructor(private listRaffleTicketsUseCase: ListRaffleTicketsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId, raffleId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");
    if (!raffleId) throw HttpAdapter.badRequest("raffleId is required");

    const scopedParams = SearchParamsMapper.toObject({
      query: route.query,
      params: route.params,
      scoped: "tickets",
    });

    const result = await this.listRaffleTicketsUseCase.execute({
      raffleId,
      page: scopedParams.page ? Number(scopedParams.page) : 1,
      search: scopedParams.search,
    });

    // impede acessar, pela URL, bilhetes de um sorteio de outra campanha
    if (result.raffle.accountReference !== campaignId) {
      throw HttpAdapter.notFound("Sorteio não encontrado");
    }

    return result;
  }
}

export { ListRaffleTicketsController };
