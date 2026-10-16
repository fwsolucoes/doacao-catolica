import type { PaymentGatewayDTO } from "~/domain/gateways/payment";

class CancelManualPaymentUseCase {
  constructor(private gateway: PaymentGatewayDTO) {}

  async execute(accountUuid: string, paymentId: string): Promise<string> {
    return await this.gateway.cancelManualPayment(accountUuid, paymentId);
  }
}

export { CancelManualPaymentUseCase };
