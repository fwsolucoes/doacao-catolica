import type { AccountWhatsappSettingsGatewayDTO } from "~/domain/gateways/accountWhatsappSettings";

class GetAccountWhatsappSettingsUseCase {
  constructor(private gateway: AccountWhatsappSettingsGatewayDTO) {}

  async execute(accountReference: string) {
    return await this.gateway.getAccountWhatsappSettings(accountReference);
  }
}

export { GetAccountWhatsappSettingsUseCase };
