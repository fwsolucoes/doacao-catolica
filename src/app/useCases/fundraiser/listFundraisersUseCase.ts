import type { FundraiserGatewayDTO } from "~/domain/gateways/fundraiser";

type InputProps = {
  campaignId: string;
};

class ListFundraisersUseCase {
  constructor(private gateway: FundraiserGatewayDTO) {}

  async execute(input: InputProps, token: string) {
    const result = await this.gateway.listFundraisers(input.campaignId, token);
    return result.toJson();
  }
}

export { ListFundraisersUseCase };
