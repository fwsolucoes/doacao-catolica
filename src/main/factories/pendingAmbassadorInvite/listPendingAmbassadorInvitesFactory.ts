import { ListPendingAmbassadorInvitesUseCase } from "~/app/useCases/pendingAmbassadorInvite/listPendingAmbassadorInvitesUseCase";
import { ListPendingAmbassadorInvitesController } from "~/infra/controllers/pendingAmbassadorInvite/listPendingAmbassadorInvitesController";
import { PendingAmbassadorInviteGateway } from "~/infra/gateways/pendingAmbassadorInvite";

const gateway = new PendingAmbassadorInviteGateway();
const useCase = new ListPendingAmbassadorInvitesUseCase(gateway);
const controller = new ListPendingAmbassadorInvitesController(useCase);

const listPendingAmbassadorInvites = {
  handle: controller.handle.bind(controller),
};

export { listPendingAmbassadorInvites };
