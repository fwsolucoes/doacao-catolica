import { LinkAmbassadorUseCase } from "~/app/useCases/linkAmbassador/linkAmbassadorUseCase";
import { LinkAmbassadorController } from "~/infra/controllers/linkAmbassador/linkAmbassadorController";
import { SubscriptionGateway } from "~/infra/gateways/subscription";

const subscriptionGateway = new SubscriptionGateway();
const linkAmbassadorUseCase = new LinkAmbassadorUseCase(subscriptionGateway);
const linkAmbassadorController = new LinkAmbassadorController(
  linkAmbassadorUseCase,
);

const linkAmbassador = {
  handle: linkAmbassadorController.handle.bind(linkAmbassadorController),
};

export { linkAmbassador };
