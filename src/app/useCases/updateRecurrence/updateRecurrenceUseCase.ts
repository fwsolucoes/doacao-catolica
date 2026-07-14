import type { SubscriptionGatewayDTO } from "~/domain/gateways/subscription";

type UpdateRecurrenceInput = {
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

class UpdateRecurrenceUseCase {
  constructor(private subscriptionGateway: SubscriptionGatewayDTO) {}

  async execute(input: UpdateRecurrenceInput): Promise<void> {
    await this.subscriptionGateway.updateSubscription({
      paymentPublicId: input.paymentPublicId,
      payDay: input.payDay,
      type: input.type,
      amount: input.amount,
      undeterminedAmount: input.undeterminedAmount,
      description: input.description,
      activeNotification: input.activeNotification,
      perpetuatePaymentsChange: input.perpetuatePaymentsChange,
      discount: input.discount,
      interest: input.interest,
      fineType: input.fineType,
      fineValue: input.fineValue,
    });
  }
}

export { UpdateRecurrenceUseCase, type UpdateRecurrenceInput };
