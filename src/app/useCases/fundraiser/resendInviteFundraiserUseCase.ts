import type { FundraiserGatewayDTO } from "~/domain/gateways/fundraiser";

class ResendInviteFundraiserUseCase {
  constructor(private gateway: FundraiserGatewayDTO) {}

  async execute(id: string, token: string): Promise<void> {
    await this.gateway.resendInviteFundraiser(id, token);
  }
}

export { ResendInviteFundraiserUseCase };
