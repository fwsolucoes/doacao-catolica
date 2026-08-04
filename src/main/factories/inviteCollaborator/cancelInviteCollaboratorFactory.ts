import { CancelInviteCollaboratorUseCase } from "~/app/useCases/inviteCollaborator/cancelInviteCollaboratorUseCase";
import { CancelInviteCollaboratorController } from "~/infra/controllers/inviteCollaborator/cancelInviteCollaboratorController";
import { InviteCollaboratorGateway } from "~/infra/gateways/inviteCollaborator";

const inviteCollaboratorGateway = new InviteCollaboratorGateway();
const cancelInviteCollaboratorUseCase = new CancelInviteCollaboratorUseCase(
  inviteCollaboratorGateway,
);
const cancelInviteCollaboratorController = new CancelInviteCollaboratorController(
  cancelInviteCollaboratorUseCase,
);

const cancelInviteCollaborator = {
  handle: cancelInviteCollaboratorController.handle.bind(
    cancelInviteCollaboratorController,
  ),
};

export { cancelInviteCollaborator };
