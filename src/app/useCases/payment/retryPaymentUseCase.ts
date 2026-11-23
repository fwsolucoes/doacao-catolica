import type { PaymentGatewayDTO } from "~/domain/gateways/payment";

class RetryPaymentUseCase {
  constructor(private gateway: PaymentGatewayDTO) {}

  async execute(paymentUuid: string): Promise<string> {
    return await this.gateway.retryPayment(paymentUuid);
  }
}

export { RetryPaymentUseCase };
