import type { DonorGatewayDTO } from "~/domain/gateways/donor";
import type { SubscriptionGatewayDTO } from "~/domain/gateways/subscription";

type CreateRecurrenceInput = {
  // contact
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCpf?: string;
  contactBirthDate?: string;
  // campaign
  accountId: number;
  campaignId: string;
  category: "donation" | "tithe";
  token: string;
  // payment
  paymentDay: number;
  paymentType: "pix" | "bank_slip";
  amount: number;
  undeterminedAmount: boolean;
  currentMonthPayment: boolean;
  activeNotification: boolean;
  description?: string;
  discount?: number;
  interest?: number;
  fineType?: "fixed" | "percentage";
  fineValue?: number;
};

class CreateRecurrenceUseCase {
  constructor(
    private donorGateway: DonorGatewayDTO,
    private subscriptionGateway: SubscriptionGatewayDTO,
  ) {}

  async execute(input: CreateRecurrenceInput): Promise<void> {
    const donatorId = await this.donorGateway.createDonor({
      accountId: input.accountId,
      name: input.contactName,
      cpf: input.contactCpf,
      birthDate: input.contactBirthDate,
      email: input.contactEmail,
      phone: input.contactPhone,
      projectId: input.campaignId,
      token: input.token,
    });

    await this.subscriptionGateway.createSubscription({
      accountReference: input.campaignId,
      donatorId,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      contactCpf: input.contactCpf,
      contactBirthDate: input.contactBirthDate,
      category: input.category,
      paymentType: input.paymentType,
      paymentDay: input.paymentDay,
      amount: input.amount,
      undeterminedAmount: input.undeterminedAmount,
      createPayment: input.currentMonthPayment,
      activeNotification: input.activeNotification,
      description: input.description,
      discount: input.discount,
      interest: input.interest,
      fineType: input.fineType,
      fineValue: input.fineValue,
    });
  }
}

export { CreateRecurrenceUseCase, type CreateRecurrenceInput };
