import { ListOneTimeDonorsUseCase } from "~/app/useCases/listOneTimeDonors/listOneTimeDonorsUseCase";
import { ListOneTimeDonorsController } from "~/infra/controllers/listOneTimeDonors/listOneTimeDonorsController";
import { DonorGateway } from "~/infra/gateways/donor";

const donorGateway = new DonorGateway();
const listOneTimeDonorsUseCase = new ListOneTimeDonorsUseCase(donorGateway);
const listOneTimeDonorsController = new ListOneTimeDonorsController(
  listOneTimeDonorsUseCase,
);

const listOneTimeDonors = {
  handle: listOneTimeDonorsController.handle.bind(listOneTimeDonorsController),
};

export { listOneTimeDonors };
