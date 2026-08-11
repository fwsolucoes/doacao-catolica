import { GetDonationsSummaryUseCase } from "~/app/useCases/donationsSummary/getDonationsSummaryUseCase";
import { GetDonationsSummaryController } from "~/infra/controllers/donationsSummary/getDonationsSummaryController";
import { DonationsSummaryGateway } from "~/infra/gateways/donationsSummary";

const donationsSummaryGateway = new DonationsSummaryGateway();
const getDonationsSummaryUseCase = new GetDonationsSummaryUseCase(
  donationsSummaryGateway,
);
const getDonationsSummaryController = new GetDonationsSummaryController(
  getDonationsSummaryUseCase,
);

const getDonationsSummary = {
  handle: getDonationsSummaryController.handle.bind(
    getDonationsSummaryController,
  ),
};

export { getDonationsSummary };
