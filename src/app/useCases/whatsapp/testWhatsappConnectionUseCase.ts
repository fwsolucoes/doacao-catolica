import type { WhatsappConnectionGatewayDTO } from "~/domain/gateways/whatsappConnection";

class TestWhatsappConnectionUseCase {
  constructor(private gateway: WhatsappConnectionGatewayDTO) {}

  async execute(token: string) {
    return await this.gateway.testConnection(token);
  }
}

export { TestWhatsappConnectionUseCase };
