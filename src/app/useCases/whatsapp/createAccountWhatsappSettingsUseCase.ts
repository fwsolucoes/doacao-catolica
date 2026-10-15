import type { AccountWhatsappSettingsGatewayDTO } from "~/domain/gateways/accountWhatsappSettings";

type InputProps = {
  accountReference: string;
  provider: string;
  type: string;
};

class CreateAccountWhatsappSettingsUseCase {
  constructor(private gateway: AccountWhatsappSettingsGatewayDTO) {}

  async execute(input: InputProps) {
    await this.gateway.createAccountWhatsappSettings({
      accountReference: input.accountReference,
      provider: input.provider,
      type: input.type,
      active: true,
      utilityFee: 0,
      marketingFee: 0,
    });
    return { success: true };
  }
}

export { CreateAccountWhatsappSettingsUseCase };
