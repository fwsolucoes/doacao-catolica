import type { AccountWebhookGatewayDTO } from "~/domain/gateways/accountWebhook";

class DeleteAccountWebhookUseCase {
  constructor(private gateway: AccountWebhookGatewayDTO) {}

  async execute(webhookId: string): Promise<void> {
    await this.gateway.deleteAccountWebhook(webhookId);
  }
}

export { DeleteAccountWebhookUseCase };
