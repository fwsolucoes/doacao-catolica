import type { PaymentGatewayDTO } from "~/domain/gateways/payment";

class CancelPaymentUseCase {
  constructor(private gateway: PaymentGatewayDTO) {}

  async execute(accountUuid: string, paymentId: string): Promise<void> {
    await this.gateway.cancelPayment(accountUuid, [paymentId]);
  }
}

export { CancelPaymentUseCase };
