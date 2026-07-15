import { EnableRecurrenceUseCase } from "~/app/useCases/enableRecurrence/enableRecurrenceUseCase";
import { EnableRecurrenceController } from "~/infra/controllers/enableRecurrence/enableRecurrenceController";
import { SubscriptionGateway } from "~/infra/gateways/subscription";

const subscriptionGateway = new SubscriptionGateway();
const enableRecurrenceUseCase = new EnableRecurrenceUseCase(subscriptionGateway);
const enableRecurrenceController = new EnableRecurrenceController(
  enableRecurrenceUseCase,
);

const enableRecurrence = {
  handle: enableRecurrenceController.handle.bind(enableRecurrenceController),
};

export { enableRecurrence };
