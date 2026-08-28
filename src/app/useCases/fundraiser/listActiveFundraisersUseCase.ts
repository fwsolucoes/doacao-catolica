import type { FundraiserGatewayDTO } from "~/domain/gateways/fundraiser";

type InputProps = {
  campaignId: string;
  page: number;
  search?: string;
};

class ListActiveFundraisersUseCase {
  constructor(private gateway: FundraiserGatewayDTO) {}

  async execute(input: InputProps, token: string) {
    const result = await this.gateway.listActiveFundraisers(
      input.campaignId,
      token,
      input.page,
      input.search,
    );
    return result.toJson();
  }
}

export { ListActiveFundraisersUseCase };
