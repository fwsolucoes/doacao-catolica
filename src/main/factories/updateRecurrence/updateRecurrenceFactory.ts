import { UpdateRecurrenceUseCase } from "~/app/useCases/updateRecurrence/updateRecurrenceUseCase";
import { UpdateRecurrenceController } from "~/infra/controllers/updateRecurrence/updateRecurrenceController";
import { SubscriptionGateway } from "~/infra/gateways/subscription";

const subscriptionGateway = new SubscriptionGateway();
const updateRecurrenceUseCase = new UpdateRecurrenceUseCase(subscriptionGateway);
const updateRecurrenceController = new UpdateRecurrenceController(updateRecurrenceUseCase);

const updateRecurrence = {
  handle: updateRecurrenceController.handle.bind(updateRecurrenceController),
};

export { updateRecurrence };
