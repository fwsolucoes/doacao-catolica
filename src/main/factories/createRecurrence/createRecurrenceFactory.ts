import { CreateRecurrenceUseCase } from "~/app/useCases/createRecurrence/createRecurrenceUseCase";
import { CreateRecurrenceController } from "~/infra/controllers/createRecurrence/createRecurrenceController";
import { DonorGateway } from "~/infra/gateways/donor";
import { SubscriptionGateway } from "~/infra/gateways/subscription";

const donorGateway = new DonorGateway();
const subscriptionGateway = new SubscriptionGateway();
const createRecurrenceUseCase = new CreateRecurrenceUseCase(
  donorGateway,
  subscriptionGateway,
);
const createRecurrenceController = new CreateRecurrenceController(
  createRecurrenceUseCase,
);

const createRecurrence = {
  handle: createRecurrenceController.handle.bind(createRecurrenceController),
};

export { createRecurrence };
