import type { GetDonorHealthUseCase } from "~/app/useCases/donorHealth/getDonorHealthUseCase";
import { SchemaValidatorAdapter } from "~/infra/adapters/schemaValidatorAdapter";
import { donorHealthQuerySchema } from "~/infra/schemas/internal/donorHealth";
import type { RouteDTO } from "~/main/types/route";

type Overrides = { accountId: number };

class GetDonorHealthController {
  constructor(private useCase: GetDonorHealthUseCase) {}

  async handle(route: RouteDTO, overrides: Overrides) {
    const query = new SchemaValidatorAdapter(donorHealthQuerySchema).validate(
      route.query,
    );

    return await this.useCase.execute({
      accountId: overrides.accountId,
      months: query.months,
      lapseMonths: query.lapse_months,
    });
  }
}

export { GetDonorHealthController };
