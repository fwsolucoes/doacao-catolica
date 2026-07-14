import { DisableRecurrenceUseCase } from "~/app/useCases/disableRecurrence/disableRecurrenceUseCase";
import { DisableRecurrenceController } from "~/infra/controllers/disableRecurrence/disableRecurrenceController";
import { SubscriptionGateway } from "~/infra/gateways/subscription";

const subscriptionGateway = new SubscriptionGateway();
const disableRecurrenceUseCase = new DisableRecurrenceUseCase(subscriptionGateway);
const disableRecurrenceController = new DisableRecurrenceController(disableRecurrenceUseCase);

const disableRecurrence = {
  handle: disableRecurrenceController.handle.bind(disableRecurrenceController),
};

export { disableRecurrence };
