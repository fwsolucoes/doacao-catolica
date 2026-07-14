import type { ListRecurringDonorsUseCase } from "~/app/useCases/listRecurringDonors/listRecurringDonorsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListRecurringDonorsController {
  constructor(private listRecurringDonorsUseCase: ListRecurringDonorsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listRecurringDonorsUseCase.execute({
      campaignId,
      page,
      search: route.query.donor_search,
    });
  }
}

export { ListRecurringDonorsController };
