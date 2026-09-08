import type { AccountWhatsappSettingsGatewayDTO } from "~/domain/gateways/accountWhatsappSettings";

type InputProps = {
  accountReference: string;
  provider: string;
  type: string;
};

class UpdateAccountWhatsappSettingsUseCase {
  constructor(private gateway: AccountWhatsappSettingsGatewayDTO) {}

  async execute(input: InputProps) {
    await this.gateway.updateAccountWhatsappSettings(input);
    return { success: true };
  }
}

export { UpdateAccountWhatsappSettingsUseCase };
