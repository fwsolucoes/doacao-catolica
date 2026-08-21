import type { GetFundraiserDetailsUseCase } from "~/app/useCases/fundraiser/getFundraiserDetailsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetFundraiserDetailsController {
  constructor(private useCase: GetFundraiserDetailsUseCase) {}

  async handle(route: RouteDTO) {
    const { fundraiserId } = route.params;
    if (!fundraiserId) throw HttpAdapter.badRequest("fundraiserId is required");

    return await this.useCase.execute(fundraiserId);
  }
}

export { GetFundraiserDetailsController };
