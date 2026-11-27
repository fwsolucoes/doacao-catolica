import { ListAccountWebhooksUseCase } from "~/app/useCases/accountWebhook/listAccountWebhooksUseCase";
import { ListAccountWebhooksController } from "~/infra/controllers/accountWebhook/listAccountWebhooksController";
import { AccountWebhookGateway } from "~/infra/gateways/accountWebhook";

const accountWebhookGateway = new AccountWebhookGateway();
const useCase = new ListAccountWebhooksUseCase(accountWebhookGateway);
const controller = new ListAccountWebhooksController(useCase);

const listAccountWebhooks = {
  handle: controller.handle.bind(controller),
};

export { listAccountWebhooks };
