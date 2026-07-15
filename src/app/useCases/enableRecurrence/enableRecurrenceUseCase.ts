import type { SubscriptionGatewayDTO } from "~/domain/gateways/subscription";

type EnableRecurrenceInput = {
  subscriptionUuid: string;
  observation?: string;
};

class EnableRecurrenceUseCase {
  constructor(private subscriptionGateway: SubscriptionGatewayDTO) {}

  async execute(input: EnableRecurrenceInput): Promise<void> {
    await this.subscriptionGateway.enableSubscription({
      subscriptionUuid: input.subscriptionUuid,
      observation: input.observation,
    });
  }
}

export { EnableRecurrenceUseCase, type EnableRecurrenceInput };
