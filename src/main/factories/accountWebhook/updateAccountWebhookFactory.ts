import { UpdateAccountWebhookUseCase } from "~/app/useCases/accountWebhook/updateAccountWebhookUseCase";
import { UpdateAccountWebhookController } from "~/infra/controllers/accountWebhook/updateAccountWebhookController";
import { AccountWebhookGateway } from "~/infra/gateways/accountWebhook";

const accountWebhookGateway = new AccountWebhookGateway();
const useCase = new UpdateAccountWebhookUseCase(accountWebhookGateway);
const controller = new UpdateAccountWebhookController(useCase);

const updateAccountWebhook = {
  handle: controller.handle.bind(controller),
};

export { updateAccountWebhook };
