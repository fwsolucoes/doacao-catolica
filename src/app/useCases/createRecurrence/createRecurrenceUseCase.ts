import type { ContactGatewayDTO } from "~/domain/gateways/contact";
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
  missingFields?: true;
  // campaign
  accountId: number;
  campaignId: string;
  category: "donation" | "tithe";
  token: string;
  // payment
  paymentDay: number;
  paymentType: "pix" | "bank_slip" | "credit_card";
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
    private contactGateway: ContactGatewayDTO,
    private donorGateway: DonorGatewayDTO,
    private subscriptionGateway: SubscriptionGatewayDTO,
  ) {}

  async execute(input: CreateRecurrenceInput): Promise<string> {
    input.missingFields &&
      (await this.contactGateway.updateContact({
        id: input.contactId,
        accountId: input.accountId,
        name: input.contactName,
        cpf: input.contactCpf,
        birthDate: input.contactBirthDate,
        email: input.contactEmail,
        phone: input.contactPhone,
        token: input.token,
      }));

    const donorId = await this.donorGateway.createDonor({
      accountId: input.accountId,
      name: input.contactName,
      cpf: input.contactCpf,
      birthDate: input.contactBirthDate,
      email: input.contactEmail,
      phone: input.contactPhone,
      projectId: input.campaignId,
      token: input.token,
    });

    return await this.subscriptionGateway.createSubscription({
      accountReference: input.campaignId,
      contactId: input.contactId,
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
      donorId,
    });
  }
}

export { CreateRecurrenceUseCase, type CreateRecurrenceInput };
