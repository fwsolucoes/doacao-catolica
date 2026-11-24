import { RegistrationsWithoutDonationsSearchParams } from "~/app/search/registrationsWithoutDonationsSearchParams";
import type { RegistrationsWithoutDonationsGatewayDTO } from "~/domain/gateways/registrationsWithoutDonations";

type InputProps = {
  accountUuid: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  search?: string;
  page?: number;
};

const PAGE_LIMIT = 20;

class GetRegistrationsWithoutDonationsUseCase {
  constructor(private gateway: RegistrationsWithoutDonationsGatewayDTO) {}

  async execute(input: InputProps) {
    const searchParams = new RegistrationsWithoutDonationsSearchParams({
      page: input.page ?? 1,
      filter: {
        account_uuid: input.accountUuid,
        period: input.period,
        start_date: input.startDate,
        end_date: input.endDate,
        type: input.type,
        search: input.search,
        per_page: PAGE_LIMIT,
      },
    });

    return this.gateway.getRegistrationsWithoutDonations(searchParams);
  }
}

export { GetRegistrationsWithoutDonationsUseCase };
