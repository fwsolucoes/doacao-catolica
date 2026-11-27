import { GetDonorHealthUseCase } from "~/app/useCases/donorHealth/getDonorHealthUseCase";
import { GetDonorHealthController } from "~/infra/controllers/donorHealth/getDonorHealthController";
import { DonorHealthGateway } from "~/infra/gateways/donorHealth";

const donorHealthGateway = new DonorHealthGateway();
const getDonorHealthUseCase = new GetDonorHealthUseCase(donorHealthGateway);
const getDonorHealthController = new GetDonorHealthController(
  getDonorHealthUseCase,
);

const getDonorHealth = {
  handle: getDonorHealthController.handle.bind(getDonorHealthController),
};

export { getDonorHealth };
