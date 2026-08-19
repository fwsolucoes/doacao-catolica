import type { PixAuthorizationSummaryGatewayDTO } from "~/domain/gateways/pixAuthorizationSummary";

type InputProps = {
  accountUuid: string;
};

class GetPixAuthorizationSummaryUseCase {
  constructor(private gateway: PixAuthorizationSummaryGatewayDTO) {}

  async execute(input: InputProps) {
    return this.gateway.getSummary(input.accountUuid);
  }
}

export { GetPixAuthorizationSummaryUseCase };
