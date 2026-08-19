import type { ManualPaymentData, PaymentGatewayDTO } from "~/domain/gateways/payment";

class ManualPaymentUseCase {
  constructor(private gateway: PaymentGatewayDTO) {}

  async execute(accountUuid: string, data: ManualPaymentData): Promise<void> {
    await this.gateway.manualPayment(accountUuid, data);
  }
}

export { ManualPaymentUseCase };
