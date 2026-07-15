import type { ListOneTimeDonorsUseCase } from "~/app/useCases/listOneTimeDonors/listOneTimeDonorsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class ListOneTimeDonorsController {
  constructor(private listOneTimeDonorsUseCase: ListOneTimeDonorsUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const page = route.query.page ? Number(route.query.page) : 1;

    return await this.listOneTimeDonorsUseCase.execute({
      campaignId,
      page,
      search: route.query.donor_search,
      registeredStart: route.query.registered_start,
      registeredEnd: route.query.registered_end,
      isRecurring: route.query.is_recurring,
    });
  }
}

export { ListOneTimeDonorsController };
