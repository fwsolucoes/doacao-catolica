import { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { DonorGatewayDTO } from "~/domain/gateways/donor";

type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
};

class ListRecurringDonorsUseCase {
  constructor(private donorGateway: DonorGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignId, page, search } = input;

    const searchParams = new DonorSearchParams({
      page: page ?? 1,
      filter: { search },
    });

    const result = await this.donorGateway.listRecurringDonors(
      campaignId,
      searchParams,
    );

    return result.toJson();
  }
}

export { ListRecurringDonorsUseCase };
