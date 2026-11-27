import { UpdateAccountWebhookUseCase } from "~/app/useCases/accountWebhook/updateAccountWebhookUseCase";
import { ToggleAccountWebhookController } from "~/infra/controllers/accountWebhook/toggleAccountWebhookController";
import { AccountWebhookGateway } from "~/infra/gateways/accountWebhook";

const accountWebhookGateway = new AccountWebhookGateway();
const useCase = new UpdateAccountWebhookUseCase(accountWebhookGateway);
const controller = new ToggleAccountWebhookController(useCase);

const toggleAccountWebhook = {
  handle: controller.handle.bind(controller),
};

export { toggleAccountWebhook };
