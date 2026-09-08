import type {
  AccountWhatsappSettingsGatewayDTO,
  CreateAccountWhatsappSettingsInput,
  UpdateAccountWhatsappSettingsInput,
} from "~/domain/gateways/accountWhatsappSettings";
import { environmentVariables } from "~/main/config/environmentVariables";
import { donationApi } from "../http/donationApi";

class AccountWhatsappSettingsGateway
  implements AccountWhatsappSettingsGatewayDTO
{
  async createAccountWhatsappSettings(
    input: CreateAccountWhatsappSettingsInput,
  ): Promise<void> {
    const headers = { "api-key": environmentVariables.API_KEY_DONATION };

    const body: Record<string, unknown> = {
      provider: input.provider,
      type: input.type,
      active: input.active,
      utility_fee: input.utilityFee,
      marketing_fee: input.marketingFee,
    };

    if (input.token) body.token = input.token;

    const apiResponse = await donationApi.post(
      `/account_whatsapp_settings/${input.accountReference}`,
      { body, headers },
    );

    // 409 means the account already has settings — not an error, skip silently
    if (!apiResponse.success && apiResponse.status === 409) return;

    if (!apiResponse.success) {
      throw new Error(
        `Failed to create account whatsapp settings: ${apiResponse.message}`,
      );
    }
  }

  async updateAccountWhatsappSettings(
    input: UpdateAccountWhatsappSettingsInput,
  ): Promise<void> {
    const headers = { "api-key": environmentVariables.API_KEY_DONATION };
    const body = { provider: input.provider, type: input.type };

    const apiResponse = await donationApi.put(
      `/account_whatsapp_settings/${input.accountReference}`,
      { body, headers },
    );

    if (!apiResponse.success) {
      throw new Error(
        `Failed to update account whatsapp settings: ${apiResponse.message}`,
      );
    }
  }
}

export { AccountWhatsappSettingsGateway };
