type PaymentGatewayDTO = {
  cancelPayment(accountUuid: string, payments: string[]): Promise<void>;
};

export type { PaymentGatewayDTO };
