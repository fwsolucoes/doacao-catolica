import type { FundraiserGatewayDTO } from "~/domain/gateways/fundraiser";

class CancelInviteFundraiserUseCase {
  constructor(private gateway: FundraiserGatewayDTO) {}

  async execute(id: string, token: string): Promise<void> {
    await this.gateway.cancelInviteFundraiser(id, token);
  }
}

export { CancelInviteFundraiserUseCase };
