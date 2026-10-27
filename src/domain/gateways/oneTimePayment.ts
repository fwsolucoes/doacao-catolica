type CreateOneTimePaymentInput = {
  accountReference: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCpf?: string;
  contactBirthDate?: string;
  category: "donation" | "tithe";
  paymentType: "pix" | "bank_slip";
  amount: number;
  donorId: string;
};

type OneTimePaymentGatewayDTO = {
  // returns the payment uuid
  createOneTimePayment(input: CreateOneTimePaymentInput): Promise<string>;
};

export type { OneTimePaymentGatewayDTO, CreateOneTimePaymentInput };
