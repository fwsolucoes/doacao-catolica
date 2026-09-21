import type { SuggestedValueGatewayDTO } from "~/domain/gateways/suggestedValue";

class ListSuggestedValuesUseCase {
  constructor(private gateway: SuggestedValueGatewayDTO) {}

  async execute(campaignId: string, token: string) {
    return this.gateway.list(campaignId, token);
  }
}

export { ListSuggestedValuesUseCase };
