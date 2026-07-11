import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";

class CreatePaymentMethodUseCase {
  constructor(private gateway: PaymentMethodGatewayDTO) {}

  async execute(name: string, campaignId: string): Promise<void> {
    await this.gateway.create(name, campaignId);
  }
}

export { CreatePaymentMethodUseCase };
