import type {
  CreateFundraiserInput,
  FundraiserGatewayDTO,
} from "~/domain/gateways/fundraiser";

class CreateFundraiserUseCase {
  constructor(private gateway: FundraiserGatewayDTO) {}

  async execute(input: CreateFundraiserInput, token: string): Promise<void> {
    await this.gateway.createFundraiser(input, token);
  }
}

export { CreateFundraiserUseCase };
