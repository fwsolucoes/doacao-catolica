import { FindDonatorContactUseCase } from "~/app/useCases/donor/findDonatorContactUseCase";
import { FindDonatorContactController } from "~/infra/controllers/donor/findDonatorContactController";
import { DonorGateway } from "~/infra/gateways/donor";

const donorGateway = new DonorGateway();
const findDonatorContactUseCase = new FindDonatorContactUseCase(donorGateway);
const findDonatorContactController = new FindDonatorContactController(
  findDonatorContactUseCase,
);

const findDonatorContact = {
  handle: findDonatorContactController.handle.bind(findDonatorContactController),
};

export { findDonatorContact };
