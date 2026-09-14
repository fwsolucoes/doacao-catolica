import type { PendingAmbassadorInviteGatewayDTO } from "~/domain/gateways/pendingAmbassadorInvite";

class ListPendingAmbassadorInvitesUseCase {
  constructor(private gateway: PendingAmbassadorInviteGatewayDTO) {}

  async execute(email: string, token: string) {
    const result = await this.gateway.findAll(email, token);

    return {
      items: result.items.map((invite) => invite.toJson()),
    };
  }
}

export { ListPendingAmbassadorInvitesUseCase };
