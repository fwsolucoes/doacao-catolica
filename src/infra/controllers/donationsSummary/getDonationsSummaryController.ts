import type { GetDonationsSummaryUseCase } from "~/app/useCases/donationsSummary/getDonationsSummaryUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import type { RouteDTO } from "~/main/types/route";

class GetDonationsSummaryController {
  constructor(private useCase: GetDonationsSummaryUseCase) {}

  async handle(route: RouteDTO) {
    const { campaignId } = route.params;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    return await this.useCase.execute({
      campaignId,
      startDate: route.query.start_date,
      endDate: route.query.end_date,
    });
  }
}

export { GetDonationsSummaryController };
