import type { SuggestedValueGatewayDTO } from "~/domain/gateways/suggestedValue";

class DeleteSuggestedValueUseCase {
  constructor(private gateway: SuggestedValueGatewayDTO) {}

  async execute(id: string, token: string): Promise<void> {
    await this.gateway.delete(id, token);
  }
}

export { DeleteSuggestedValueUseCase };
