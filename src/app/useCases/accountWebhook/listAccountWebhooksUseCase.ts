import type { AccountWebhookGatewayDTO } from "~/domain/gateways/accountWebhook";

class ListAccountWebhooksUseCase {
  constructor(private gateway: AccountWebhookGatewayDTO) {}

  async execute(accountReference: string) {
    const webhooks = await this.gateway.listAccountWebhooks(accountReference);
    return webhooks.map((webhook) => webhook.toJson());
  }
}

export { ListAccountWebhooksUseCase };
