import type { PaymentBookletGatewayDTO } from "~/domain/gateways/paymentBooklet";

type GeneratePaymentBookletInput = {
  accountReference: string;
  subscriptionUuid: string;
  startDate: string;
  endDate: string;
};

class GeneratePaymentBookletUseCase {
  constructor(private paymentBookletGateway: PaymentBookletGatewayDTO) {}

  async execute(input: GeneratePaymentBookletInput): Promise<string> {
    return await this.paymentBookletGateway.generatePaymentBooklet({
      accountReference: input.accountReference,
      subscriptionUuid: input.subscriptionUuid,
      startDate: input.startDate,
      endDate: input.endDate,
    });
  }
}

export { GeneratePaymentBookletUseCase, type GeneratePaymentBookletInput };
