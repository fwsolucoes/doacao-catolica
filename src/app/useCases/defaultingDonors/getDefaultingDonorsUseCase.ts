import { DefaultingDonorsSearchParams } from "~/app/search/defaultingDonorsSearchParams";
import type { DefaultingDonorsGatewayDTO } from "~/domain/gateways/defaultingDonors";

type InputProps = {
  accountUuid?: string;
  months: number;
  reference2?: string;
};

class GetDefaultingDonorsUseCase {
  constructor(private gateway: DefaultingDonorsGatewayDTO) {}

  async execute(input: InputProps) {
    const { accountUuid, months, reference2 } = input;

    const searchParams = new DefaultingDonorsSearchParams({
      filter: { account_uuid: accountUuid, months, reference_2: reference2 },
    });

    return this.gateway.getDefaultingDonors(searchParams);
  }
}

export { GetDefaultingDonorsUseCase };
