import type { GetFinancialSummaryUseCase } from "~/app/useCases/financialSummary/getFinancialSummaryUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetFinancialSummaryController {
  constructor(private useCase: GetFinancialSummaryUseCase) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    return await this.useCase.execute({
      referenceId: String(user.accountId),
      dateType: route.query.date_type,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetFinancialSummaryController };
