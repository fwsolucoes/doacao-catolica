import { CreateAccountWebhookUseCase } from "~/app/useCases/accountWebhook/createAccountWebhookUseCase";
import { CreateAccountWebhookController } from "~/infra/controllers/accountWebhook/createAccountWebhookController";
import { AccountWebhookGateway } from "~/infra/gateways/accountWebhook";

const accountWebhookGateway = new AccountWebhookGateway();
const useCase = new CreateAccountWebhookUseCase(accountWebhookGateway);
const controller = new CreateAccountWebhookController(useCase);

const createAccountWebhook = {
  handle: controller.handle.bind(controller),
};

export { createAccountWebhook };
