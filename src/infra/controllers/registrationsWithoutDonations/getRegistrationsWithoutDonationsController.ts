import type { GetRegistrationsWithoutDonationsUseCase } from "~/app/useCases/registrationsWithoutDonations/getRegistrationsWithoutDonationsUseCase";
import type { RouteDTO } from "~/main/types/route";

type Overrides = { accountUuid: string };

class GetRegistrationsWithoutDonationsController {
  constructor(private useCase: GetRegistrationsWithoutDonationsUseCase) {}

  async handle(route: RouteDTO, overrides: Overrides) {
    const { period, start_date, end_date, type, search, page } = route.query;

    return await this.useCase.execute({
      accountUuid: overrides.accountUuid,
      period,
      startDate: start_date,
      endDate: end_date,
      type,
      search,
      page: page ? Number(page) : undefined,
    });
  }
}

export { GetRegistrationsWithoutDonationsController };
