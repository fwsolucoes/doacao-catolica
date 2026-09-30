import type { GetMonthlyDonorsUseCase } from "~/app/useCases/monthlyDonors/getMonthlyDonorsUseCase";
import type { RouteDTO } from "~/main/types/route";

class GetMonthlyDonorsController {
  constructor(private useCase: GetMonthlyDonorsUseCase) {}

  async handle(route: RouteDTO, accountUuid?: string) {
    const {
      account_uuid,
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
      accountUuid: accountUuid ?? account_uuid,
      startMonth: start_month,
      endMonth: end_month,
      projectId: project_id,
      projectAccountId: project_account_id,
      search,
      name,
      cpf,
      page: page ? Number(page) : undefined,
    });
  }
}

export { GetMonthlyDonorsController };
