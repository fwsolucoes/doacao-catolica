import type { InviteCollaboratorGatewayDTO } from "~/domain/gateways/inviteCollaborator";

class CancelInviteCollaboratorUseCase {
  constructor(private gateway: InviteCollaboratorGatewayDTO) {}

  async execute(id: string, token: string): Promise<void> {
    await this.gateway.cancelInviteCollaborator(id, token);
  }
}

export { CancelInviteCollaboratorUseCase };
