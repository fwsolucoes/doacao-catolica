import type { SubscriptionGatewayDTO } from "~/domain/gateways/subscription";

type DisableRecurrenceInput = {
  subscriptionUuid: string;
  observation: string;
  perpetuatePaymentsChange: boolean;
  perpetuateNextPaymentsChange: boolean;
  origin: string;
};

class DisableRecurrenceUseCase {
  constructor(private subscriptionGateway: SubscriptionGatewayDTO) {}

  async execute(input: DisableRecurrenceInput): Promise<void> {
    await this.subscriptionGateway.disableSubscription({
      subscriptionUuid: input.subscriptionUuid,
      observation: input.observation,
      perpetuatePaymentsChange: input.perpetuatePaymentsChange,
      perpetuateNextPaymentsChange: input.perpetuateNextPaymentsChange,
      origin: input.origin,
    });
  }
}

export { DisableRecurrenceUseCase, type DisableRecurrenceInput };
