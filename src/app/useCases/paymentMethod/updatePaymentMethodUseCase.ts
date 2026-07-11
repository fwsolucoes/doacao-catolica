import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";

class UpdatePaymentMethodUseCase {
  constructor(private gateway: PaymentMethodGatewayDTO) {}

  async execute(id: string, name: string, campaignId: string): Promise<void> {
    await this.gateway.update(id, name, campaignId);
  }
}

export { UpdatePaymentMethodUseCase };
