import type {
  AccountWebhookGatewayDTO,
  UpdateAccountWebhookInput,
} from "~/domain/gateways/accountWebhook";

type InputProps = UpdateAccountWebhookInput & {
  webhookId: string;
};

class UpdateAccountWebhookUseCase {
  constructor(private gateway: AccountWebhookGatewayDTO) {}

  async execute(input: InputProps): Promise<void> {
    const { webhookId, ...webhook } = input;
    await this.gateway.updateAccountWebhook(webhookId, webhook);
  }
}

export { UpdateAccountWebhookUseCase };
