type CreateSubscriptionInput = {
  accountReference: string;
  contactId: string;
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
  donorId: string;
};

type UpdateSubscriptionInput = {
  paymentPublicId: string;
  payDay: number;
  type: "pix" | "bank_slip";
  amount: number;
  undeterminedAmount: boolean;
  description: string;
  activeNotification: number;
  perpetuatePaymentsChange: boolean;
  discount?: number;
  interest?: number;
  fineType?: "fixed" | "percentage";
  fineValue?: number;
};

type DisableSubscriptionInput = {
  subscriptionUuid: string;
  observation: string;
  perpetuatePaymentsChange: boolean;
  perpetuateNextPaymentsChange: boolean;
  origin: string;
};

type EnableSubscriptionInput = {
  subscriptionUuid: string;
  observation?: string;
};

type SubscriptionGatewayDTO = {
  createSubscription(input: CreateSubscriptionInput): Promise<string>;
  updateSubscription(input: UpdateSubscriptionInput): Promise<void>;
  disableSubscription(input: DisableSubscriptionInput): Promise<void>;
  enableSubscription(input: EnableSubscriptionInput): Promise<void>;
};

export type {
  SubscriptionGatewayDTO,
  CreateSubscriptionInput,
  DisableSubscriptionInput,
  EnableSubscriptionInput,
  UpdateSubscriptionInput,
};
