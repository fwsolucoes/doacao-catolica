import type { PixAuthorizationHistoryGatewayDTO } from "~/domain/gateways/pixAuthorizationHistory";

type InputProps = {
  subscriptionUuid: string;
};

class GetPixAuthorizationHistoryUseCase {
  constructor(private gateway: PixAuthorizationHistoryGatewayDTO) {}

  async execute(input: InputProps) {
    return this.gateway.getHistory(input.subscriptionUuid);
  }
}

export { GetPixAuthorizationHistoryUseCase };
