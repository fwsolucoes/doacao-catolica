import type { FundraiserGatewayDTO } from "~/domain/gateways/fundraiser";

class GetFundraiserDetailsUseCase {
  constructor(private gateway: FundraiserGatewayDTO) {}

  async execute(id: string) {
    const result = await this.gateway.getFundraiserDetails(id);
    return result.toJson();
  }
}

export { GetFundraiserDetailsUseCase };
