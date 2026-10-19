import type { AccountWhatsappSettingsGatewayDTO } from "~/domain/gateways/accountWhatsappSettings";
import { environmentVariables } from "~/main/config/environmentVariables";

type InputProps = {
  accountReference: string;
  provider: string;
  type: string;
  token?: string;
};

class UpdateAccountWhatsappSettingsUseCase {
  constructor(private gateway: AccountWhatsappSettingsGatewayDTO) {}

  async execute(input: InputProps) {
    await this.gateway.updateAccountWhatsappSettings({
      accountReference: input.accountReference,
      provider: input.provider,
      type: input.type,
      token: input.token,
      active: true,
      utilityFee: parseFloat(
        environmentVariables.DEFAULT_WHATSAPP_SETTINGS_UTILITY_FEE,
      ),
      marketingFee: parseFloat(
        environmentVariables.DEFAULT_WHATSAPP_SETTINGS_MARKETING_FEE,
      ),
    });
    return { success: true };
  }
}

export { UpdateAccountWhatsappSettingsUseCase };
