import type { InviteCollaboratorGatewayDTO } from "~/domain/gateways/inviteCollaborator";

class ResendInviteCollaboratorUseCase {
  constructor(private gateway: InviteCollaboratorGatewayDTO) {}

  async execute(id: string, token: string): Promise<void> {
    await this.gateway.resendInviteCollaborator(id, token);
  }
}

export { ResendInviteCollaboratorUseCase };
