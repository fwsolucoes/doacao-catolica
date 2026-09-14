import { AcceptAmbassadorInvitationUseCase } from "~/app/useCases/pendingAmbassadorInvite/acceptAmbassadorInvitationUseCase";
import { AcceptAmbassadorInvitationController } from "~/infra/controllers/pendingAmbassadorInvite/acceptAmbassadorInvitationController";
import { PendingAmbassadorInviteGateway } from "~/infra/gateways/pendingAmbassadorInvite";

const gateway = new PendingAmbassadorInviteGateway();
const useCase = new AcceptAmbassadorInvitationUseCase(gateway);
const controller = new AcceptAmbassadorInvitationController(useCase);

const acceptAmbassadorInvitation = {
  handle: controller.handle.bind(controller),
};

export { acceptAmbassadorInvitation };
