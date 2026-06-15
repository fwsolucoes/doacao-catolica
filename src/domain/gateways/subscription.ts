type CreateSubscriptionInput = {
  accountReference: string;
  donatorId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCpf?: string;
  contactBirthDate?: string;
  category: "donation" | "tithe";
  paymentType: "pix" | "bank_slip";
  paymentDay: number;
  amount: number;
  undeterminedAmount: boolean;
  createPayment: boolean;
  activeNotification: boolean;
  description?: string;
  discount?: number;
  interest?: number;
  fineType?: "fixed" | "percentage";
  fineValue?: number;
};

type SubscriptionGatewayDTO = {
  createSubscription(input: CreateSubscriptionInput): Promise<string>;
};

export type { SubscriptionGatewayDTO, CreateSubscriptionInput };
