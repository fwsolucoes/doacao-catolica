import { DefaultingDonorsSearchParams } from "~/app/search/defaultingDonorsSearchParams";
import type { DefaultingDonorsGatewayDTO } from "~/domain/gateways/defaultingDonors";

type InputProps = {
  accountUuid: string;
  months: number;
};

class GetDefaultingDonorsUseCase {
  constructor(private gateway: DefaultingDonorsGatewayDTO) {}

  async execute(input: InputProps) {
    const { accountUuid, months } = input;

    const searchParams = new DefaultingDonorsSearchParams({
      filter: { account_uuid: accountUuid, months },
    });

    return this.gateway.getDefaultingDonors(searchParams);
  }
}

export { GetDefaultingDonorsUseCase };
