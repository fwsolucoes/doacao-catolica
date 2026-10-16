type ManualPaymentData = {
  paymentId: string;
  amount: number;
  paymentDate: string;
  methodId: string;
  bankAccount?: string;
  observations?: string;
};

type PaymentGatewayDTO = {
  cancelPayment(accountUuid: string, payments: string[]): Promise<void>;
  manualPayment(accountUuid: string, data: ManualPaymentData): Promise<void>;
  cancelManualPayment(accountUuid: string, paymentUuid: string): Promise<string>;
  sendReminderNotification(paymentUuid: string): Promise<string>;
};

export type { ManualPaymentData };

export type { PaymentGatewayDTO };
