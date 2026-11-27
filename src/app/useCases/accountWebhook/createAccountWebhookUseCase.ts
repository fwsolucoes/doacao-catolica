import type {
  AccountWebhookGatewayDTO,
  AccountWebhookInput,
} from "~/domain/gateways/accountWebhook";

type InputProps = AccountWebhookInput & {
  accountReference: string;
};

class CreateAccountWebhookUseCase {
  constructor(private gateway: AccountWebhookGatewayDTO) {}

  async execute(input: InputProps): Promise<void> {
    const { accountReference, ...webhook } = input;
    await this.gateway.createAccountWebhook(accountReference, webhook);
  }
}

export { CreateAccountWebhookUseCase };
