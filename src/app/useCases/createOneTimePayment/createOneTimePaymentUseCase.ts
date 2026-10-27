import type { ContactGatewayDTO } from "~/domain/gateways/contact";
import type { DonorGatewayDTO } from "~/domain/gateways/donor";
import type { OneTimePaymentGatewayDTO } from "~/domain/gateways/oneTimePayment";

type CreateOneTimePaymentInput = {
  // contact
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactCpf?: string;
  contactBirthDate?: string;
  missingFields?: boolean;
  // campaign
  accountId: number;
  campaignId: string;
  category: "donation" | "tithe";
  token: string;
  // payment
  paymentType: "pix" | "bank_slip";
  amount: number;
};

class CreateOneTimePaymentUseCase {
  constructor(
    private contactGateway: ContactGatewayDTO,
    private donorGateway: DonorGatewayDTO,
    private oneTimePaymentGateway: OneTimePaymentGatewayDTO,
  ) {}

  // returns the payment uuid
  async execute(input: CreateOneTimePaymentInput): Promise<string> {
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

    return await this.oneTimePaymentGateway.createOneTimePayment({
      accountReference: input.campaignId,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      contactCpf: input.contactCpf,
      contactBirthDate: input.contactBirthDate,
      category: input.category,
      paymentType: input.paymentType,
      amount: input.amount,
      donorId,
    });
  }
}

export { CreateOneTimePaymentUseCase, type CreateOneTimePaymentInput };
