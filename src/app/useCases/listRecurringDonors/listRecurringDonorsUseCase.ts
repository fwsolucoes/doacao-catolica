import { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { DonorGatewayDTO, ListRecurringDonorsResult } from "~/domain/gateways/donor";

type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
};

class ListRecurringDonorsUseCase {
  constructor(private donorGateway: DonorGatewayDTO) {}

  async execute(input: InputProps): Promise<ListRecurringDonorsResult> {
    const { campaignId, page, search } = input;

    const searchParams = new DonorSearchParams({
      page: page ?? 1,
      filter: { search },
    });

    return await this.donorGateway.listRecurringDonors(campaignId, searchParams);
  }
}

export { ListRecurringDonorsUseCase };
