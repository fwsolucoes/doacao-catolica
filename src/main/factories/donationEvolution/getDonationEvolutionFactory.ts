import { GetDonationEvolutionUseCase } from "~/app/useCases/donationEvolution/getDonationEvolutionUseCase";
import { GetDonationEvolutionController } from "~/infra/controllers/donationEvolution/getDonationEvolutionController";
import { DonationEvolutionGateway } from "~/infra/gateways/donationEvolution";

const donationEvolutionGateway = new DonationEvolutionGateway();
const getDonationEvolutionUseCase = new GetDonationEvolutionUseCase(
  donationEvolutionGateway,
);
const getDonationEvolutionController = new GetDonationEvolutionController(
  getDonationEvolutionUseCase,
);

const getDonationEvolution = {
  handle: getDonationEvolutionController.handle.bind(
    getDonationEvolutionController,
  ),
};

export { getDonationEvolution };
