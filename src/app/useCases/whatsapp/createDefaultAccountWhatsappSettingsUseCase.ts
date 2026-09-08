import type { AccountWhatsappSettingsGatewayDTO } from "~/domain/gateways/accountWhatsappSettings";
import { environmentVariables } from "~/main/config/environmentVariables";

class CreateDefaultAccountWhatsappSettingsUseCase {
  constructor(private gateway: AccountWhatsappSettingsGatewayDTO) {}

  async execute(accountReference: string) {
    await this.gateway.createAccountWhatsappSettings({
      accountReference,
      provider: environmentVariables.DEFAULT_WHATSAPP_SETTINGS_PROVIDER,
      type: environmentVariables.DEFAULT_WHATSAPP_SETTINGS_TYPE,
      active: environmentVariables.DEFAULT_WHATSAPP_SETTINGS_ACTIVE !== "false",
      token: environmentVariables.DEFAULT_WHATSAPP_SETTINGS_TOKEN || undefined,
      utilityFee: parseFloat(
        environmentVariables.DEFAULT_WHATSAPP_SETTINGS_UTILITY_FEE || "0",
      ),
      marketingFee: parseFloat(
        environmentVariables.DEFAULT_WHATSAPP_SETTINGS_MARKETING_FEE || "0",
      ),
    });
    return { success: true };
  }
}

export { CreateDefaultAccountWhatsappSettingsUseCase };
