import type { SuggestedValueGatewayDTO } from "~/domain/gateways/suggestedValue";

class CreateSuggestedValueUseCase {
  constructor(private gateway: SuggestedValueGatewayDTO) {}

  async execute(description: string, amount: number, campaignId: string, token: string): Promise<void> {
    await this.gateway.create(description, amount, campaignId, token);
  }
}

export { CreateSuggestedValueUseCase };
