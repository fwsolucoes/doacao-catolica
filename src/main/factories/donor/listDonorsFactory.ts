import { ListDonorsUseCase } from "~/app/useCases/donor/listDonorsUseCase";
import { ListDonorsController } from "~/infra/controllers/donor/listDonorsController";
import { DonorGateway } from "~/infra/gateways/donor";

const donorGateway = new DonorGateway();
const listDonorsUseCase = new ListDonorsUseCase(donorGateway);
const listDonorsController = new ListDonorsController(listDonorsUseCase);

const listDonors = {
  handle: listDonorsController.handle.bind(listDonorsController),
};

export { listDonors };
