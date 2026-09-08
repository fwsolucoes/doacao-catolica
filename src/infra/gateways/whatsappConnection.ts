import type {
  TestWhatsappConnectionResult,
  WhatsappConnectionGatewayDTO,
} from "~/domain/gateways/whatsappConnection";
import { whatsappBackendApi } from "../http/whatsappBackendApi";

class WhatsappConnectionGateway implements WhatsappConnectionGatewayDTO {
  async testConnection(token: string): Promise<TestWhatsappConnectionResult> {
    const apiResponse = await whatsappBackendApi.post("/api/whatsapp-status", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { connected: apiResponse.success };
  }
}

export { WhatsappConnectionGateway };
