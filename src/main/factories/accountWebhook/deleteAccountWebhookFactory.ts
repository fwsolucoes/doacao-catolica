import { DeleteAccountWebhookUseCase } from "~/app/useCases/accountWebhook/deleteAccountWebhookUseCase";
import { DeleteAccountWebhookController } from "~/infra/controllers/accountWebhook/deleteAccountWebhookController";
import { AccountWebhookGateway } from "~/infra/gateways/accountWebhook";

const accountWebhookGateway = new AccountWebhookGateway();
const useCase = new DeleteAccountWebhookUseCase(accountWebhookGateway);
const controller = new DeleteAccountWebhookController(useCase);

const deleteAccountWebhook = {
  handle: controller.handle.bind(controller),
};

export { deleteAccountWebhook };
