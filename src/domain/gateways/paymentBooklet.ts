type GeneratePaymentBookletInput = {
  accountReference: string;
  subscriptionUuid: string;
  startDate: string;
  endDate: string;
};

type PaymentBookletGatewayDTO = {
  generatePaymentBooklet(input: GeneratePaymentBookletInput): Promise<string>;
};

export type { PaymentBookletGatewayDTO, GeneratePaymentBookletInput };
