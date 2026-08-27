import { GetDonationsSummaryUseCase } from "~/app/useCases/donationsSummary/getDonationsSummaryUseCase";
import { GetPaymentMetricsUseCase } from "~/app/useCases/paymentMetrics/getPaymentMetricsUseCase";
import { GetTransferMetricsUseCase } from "~/app/useCases/transfer/getTransferMetricsUseCase";
import { GetCampaignMetricsModalController } from "~/infra/controllers/financialSummary/getCampaignMetricsModalController";
import { DonationsSummaryGateway } from "~/infra/gateways/donationsSummary";
import { PaymentMetricsGateway } from "~/infra/gateways/paymentMetrics";
import { TransferGateway } from "~/infra/gateways/transfer";

const paymentMetricsGateway = new PaymentMetricsGateway();
const donationsSummaryGateway = new DonationsSummaryGateway();
const transferGateway = new TransferGateway();

const getCampaignMetricsModalController = new GetCampaignMetricsModalController(
  new GetPaymentMetricsUseCase(paymentMetricsGateway),
  new GetDonationsSummaryUseCase(donationsSummaryGateway),
  new GetTransferMetricsUseCase(transferGateway),
);

const getCampaignMetricsModal = {
  handle: getCampaignMetricsModalController.handle.bind(
    getCampaignMetricsModalController,
  ),
};

export { getCampaignMetricsModal };
