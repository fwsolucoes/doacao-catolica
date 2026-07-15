import type { SubscriptionGatewayDTO } from "~/domain/gateways/subscription";

type EnableRecurrenceInput = {
  subscriptionUuid: string;
};

class EnableRecurrenceUseCase {
  constructor(private subscriptionGateway: SubscriptionGatewayDTO) {}

  async execute(input: EnableRecurrenceInput): Promise<void> {
    await this.subscriptionGateway.enableSubscription({
      subscriptionUuid: input.subscriptionUuid,
    });
  }
}

export { EnableRecurrenceUseCase, type EnableRecurrenceInput };
