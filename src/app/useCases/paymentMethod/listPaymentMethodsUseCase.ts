import type { PaymentMethod } from "~/domain/entities/paymentMethod";
import type { PaymentMethodGatewayDTO } from "~/domain/gateways/paymentMethod";

class ListPaymentMethodsUseCase {
  constructor(private gateway: PaymentMethodGatewayDTO) {}

  async execute(campaignId: string): Promise<PaymentMethod[]> {
    return this.gateway.list(campaignId);
  }
}

export { ListPaymentMethodsUseCase };
