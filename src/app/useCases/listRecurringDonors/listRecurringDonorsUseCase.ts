import { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { DonorGatewayDTO } from "~/domain/gateways/donor";

type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
  registeredStart?: string;
  registeredEnd?: string;
  paymentMethod?: string;
  status?: string;
  payDay?: string;
};

class ListRecurringDonorsUseCase {
  constructor(private donorGateway: DonorGatewayDTO) {}

  async execute(input: InputProps) {
    const {
      campaignId,
      page,
      search,
      registeredStart,
      registeredEnd,
      paymentMethod,
      status,
      payDay,
    } = input;

    const searchParams = new DonorSearchParams({
      page: page ?? 1,
      filter: {
        search,
        start_date: registeredStart,
        end_date: registeredEnd,
        payment_method: paymentMethod,
        status,
        pay_day: payDay,
      },
    });

    const result = await this.donorGateway.listRecurringDonors(
      campaignId,
      searchParams,
    );

    return result.toJson();
  }
}

export { ListRecurringDonorsUseCase };
