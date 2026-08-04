import { ResendInviteCollaboratorUseCase } from "~/app/useCases/inviteCollaborator/resendInviteCollaboratorUseCase";
import { ResendInviteCollaboratorController } from "~/infra/controllers/inviteCollaborator/resendInviteCollaboratorController";
import { InviteCollaboratorGateway } from "~/infra/gateways/inviteCollaborator";

const inviteCollaboratorGateway = new InviteCollaboratorGateway();
const resendInviteCollaboratorUseCase = new ResendInviteCollaboratorUseCase(
  inviteCollaboratorGateway,
);
const resendInviteCollaboratorController =
  new ResendInviteCollaboratorController(resendInviteCollaboratorUseCase);

const resendInviteCollaborator = {
  handle: resendInviteCollaboratorController.handle.bind(
    resendInviteCollaboratorController,
  ),
};

export { resendInviteCollaborator };
