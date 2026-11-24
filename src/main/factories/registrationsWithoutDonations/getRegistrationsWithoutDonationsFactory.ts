import { GetRegistrationsWithoutDonationsUseCase } from "~/app/useCases/registrationsWithoutDonations/getRegistrationsWithoutDonationsUseCase";
import { GetRegistrationsWithoutDonationsController } from "~/infra/controllers/registrationsWithoutDonations/getRegistrationsWithoutDonationsController";
import { RegistrationsWithoutDonationsGateway } from "~/infra/gateways/registrationsWithoutDonations";

const gateway = new RegistrationsWithoutDonationsGateway();
const useCase = new GetRegistrationsWithoutDonationsUseCase(gateway);
const controller = new GetRegistrationsWithoutDonationsController(useCase);

const getRegistrationsWithoutDonations = {
  handle: controller.handle.bind(controller),
};

export { getRegistrationsWithoutDonations };
