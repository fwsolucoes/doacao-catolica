import type { SuggestedValueGatewayDTO } from "~/domain/gateways/suggestedValue";

class UpdateSuggestedValueUseCase {
  constructor(private gateway: SuggestedValueGatewayDTO) {}

  async execute(id: string, description: string, amount: number, token: string): Promise<void> {
    await this.gateway.update(id, description, amount, token);
  }
}

export { UpdateSuggestedValueUseCase };
