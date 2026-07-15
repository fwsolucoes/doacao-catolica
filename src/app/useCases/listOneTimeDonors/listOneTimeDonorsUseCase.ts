import { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { DonorGatewayDTO } from "~/domain/gateways/donor";

type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
  registeredStart?: string;
  registeredEnd?: string;
  isRecurring?: string;
};

class ListOneTimeDonorsUseCase {
  constructor(private donorGateway: DonorGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignId, page, search, registeredStart, registeredEnd, isRecurring } = input;

    const recurrent =
      isRecurring === "true" ? "1" : isRecurring === "false" ? "0" : undefined;

    const searchParams = new DonorSearchParams({
      page: page ?? 1,
      filter: {
        search,
        start_date: registeredStart,
        end_date: registeredEnd,
        recurrent,
      },
    });

    const result = await this.donorGateway.listOneTimeDonors(
      campaignId,
      searchParams,
    );

    return result.toJson();
  }
}

export { ListOneTimeDonorsUseCase };
