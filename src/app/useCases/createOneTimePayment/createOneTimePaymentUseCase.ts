type CreateOneTimePaymentInput = {
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCpf?: string;
  contactBirthDate?: string;
  accountId: number;
  campaignId: string;
  category: "donation" | "tithe";
  token: string;
  paymentType: "pix" | "bank_slip";
  amount: number;
  description?: string;
};

class CreateOneTimePaymentUseCase {
  async execute(input: CreateOneTimePaymentInput): Promise<void> {
    // await donationApi.createPayment({
    //   contactId: input.contactId,
    //   contactName: input.contactName,
    //   contactEmail: input.contactEmail,
    //   contactPhone: input.contactPhone,
    //   contactCpf: input.contactCpf,
    //   contactBirthDate: input.contactBirthDate,
    //   accountId: input.accountId,
    //   campaignId: input.campaignId,
    //   category: input.category,
    //   paymentType: input.paymentType,
    //   amount: input.amount,
    //   description: input.description,
    // });
  }
}

export { CreateOneTimePaymentUseCase, type CreateOneTimePaymentInput };
