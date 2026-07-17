import type { GetDonationEvolutionUseCase } from "~/app/useCases/donationEvolution/getDonationEvolutionUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetDonationEvolutionController {
  constructor(private useCase: GetDonationEvolutionUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const month = route.query.month ? Number(route.query.month) : undefined;
    const year = route.query.year ? Number(route.query.year) : undefined;

    return await this.useCase.execute({ campaignId, month, year });
  }
}

export { GetDonationEvolutionController };
