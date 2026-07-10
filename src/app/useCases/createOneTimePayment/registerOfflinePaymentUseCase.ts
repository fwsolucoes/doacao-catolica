type RegisterOfflinePaymentInput = {
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
  amount: number;
  paymentDate?: string;
  method: string;
  bankAccount?: string;
  observations?: string;
};

class RegisterOfflinePaymentUseCase {
  async execute(input: RegisterOfflinePaymentInput): Promise<void> {
    // await donationApi.registerOfflinePayment({
    //   contactId: input.contactId,
    //   contactName: input.contactName,
    //   contactEmail: input.contactEmail,
    //   contactPhone: input.contactPhone,
    //   contactCpf: input.contactCpf,
    //   contactBirthDate: input.contactBirthDate,
    //   accountId: input.accountId,
    //   campaignId: input.campaignId,
    //   category: input.category,
    //   amount: input.amount,
    //   paymentDate: input.paymentDate,
    //   method: input.method,
    //   bankAccount: input.bankAccount,
    //   observations: input.observations,
    // });
  }
}

export { RegisterOfflinePaymentUseCase, type RegisterOfflinePaymentInput };
