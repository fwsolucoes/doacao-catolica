import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";

class DeletePaymentMethodUseCase {
  constructor(private gateway: PaymentMethodGatewayDTO) {}

  async execute(id: string, campaignId: string): Promise<void> {
    await this.gateway.delete(id, campaignId);
  }
}

export { DeletePaymentMethodUseCase };
