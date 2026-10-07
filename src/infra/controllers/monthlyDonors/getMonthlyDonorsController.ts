import type { GetMonthlyDonorsUseCase } from "~/app/useCases/monthlyDonors/getMonthlyDonorsUseCase";
import type { RouteDTO } from "~/main/types/route";

type Overrides = { projectId?: string; projectAccountId?: string };

class GetMonthlyDonorsController {
  constructor(private useCase: GetMonthlyDonorsUseCase) {}

  async handle(route: RouteDTO, overrides?: Overrides) {
    const {
      start_month,
      end_month,
      project_id,
      project_account_id,
      search,
      name,
      cpf,
      page,
    } = route.query;

    return await this.useCase.execute({
      startMonth: start_month,
      endMonth: end_month,
      projectId: overrides?.projectId ?? project_id,
      projectAccountId: overrides?.projectAccountId ?? project_account_id,
      search,
      name,
      cpf,
      page: page ? Number(page) : undefined,
    });
  }
}

export { GetMonthlyDonorsController };
