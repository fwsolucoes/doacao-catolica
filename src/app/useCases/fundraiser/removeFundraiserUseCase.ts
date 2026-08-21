import type { FundraiserGatewayDTO } from "~/domain/gateways/fundraiser";

class RemoveFundraiserUseCase {
  constructor(private gateway: FundraiserGatewayDTO) {}

  async execute(id: string, token: string): Promise<void> {
    await this.gateway.removeFundraiser(id, token);
  }
}

export { RemoveFundraiserUseCase };
