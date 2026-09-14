import type {
  AcceptAmbassadorInvitationInput,
  PendingAmbassadorInviteGatewayDTO,
} from "~/domain/gateways/pendingAmbassadorInvite";

class AcceptAmbassadorInvitationUseCase {
  constructor(private gateway: PendingAmbassadorInviteGatewayDTO) {}

  async execute(input: AcceptAmbassadorInvitationInput, token: string) {
    await this.gateway.acceptInvitation(input, token);
  }
}

export { AcceptAmbassadorInvitationUseCase };
