import { ListRecurringDonorsUseCase } from "~/app/useCases/listRecurringDonors/listRecurringDonorsUseCase";
import { ListRecurringDonorsController } from "~/infra/controllers/listRecurringDonors/listRecurringDonorsController";
import { DonorGateway } from "~/infra/gateways/donor";

const donorGateway = new DonorGateway();
const listRecurringDonorsUseCase = new ListRecurringDonorsUseCase(donorGateway);
const listRecurringDonorsController = new ListRecurringDonorsController(
  listRecurringDonorsUseCase,
);

const listRecurringDonors = {
  handle: listRecurringDonorsController.handle.bind(listRecurringDonorsController),
};

export { listRecurringDonors };
