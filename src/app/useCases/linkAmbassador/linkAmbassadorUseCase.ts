import type { SubscriptionGatewayDTO } from "~/domain/gateways/subscription";

type LinkAmbassadorInput = {
  subscriptionUuid: string;
  affiliateReference: string;
};

class LinkAmbassadorUseCase {
  constructor(private subscriptionGateway: SubscriptionGatewayDTO) {}

  async execute(input: LinkAmbassadorInput): Promise<void> {
    await this.subscriptionGateway.linkAmbassador({
      subscriptionUuid: input.subscriptionUuid,
      affiliateReference: input.affiliateReference,
    });
  }
}

export { LinkAmbassadorUseCase, type LinkAmbassadorInput };
