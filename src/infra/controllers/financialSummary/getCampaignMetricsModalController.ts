import type { GetDonationsSummaryUseCase } from "~/app/useCases/donationsSummary/getDonationsSummaryUseCase";
import type { GetPaymentMetricsUseCase } from "~/app/useCases/paymentMetrics/getPaymentMetricsUseCase";
import type { GetTransferMetricsUseCase } from "~/app/useCases/transfer/getTransferMetricsUseCase";
import { HttpAdapter } from "~/infra/adapters/httpAdapter";
import { AuthService } from "~/infra/services/authService";
import type { RouteDTO } from "~/main/types/route";

class GetCampaignMetricsModalController {
  constructor(
    private getPaymentMetricsUseCase: GetPaymentMetricsUseCase,
    private getDonationsSummaryUseCase: GetDonationsSummaryUseCase,
    private getTransferMetricsUseCase: GetTransferMetricsUseCase,
  ) {}

  async handle(route: RouteDTO) {
    const user = await AuthService.getAuthStorage(route);
    if (!user) throw HttpAdapter.unauthorized("Unauthorized");

    const { campaignId } = route.query;
    if (!campaignId) throw HttpAdapter.badRequest("campaignId is required");

    const [paymentMetrics, donationsSummary, transferMetrics] =
      await Promise.all([
        this.getPaymentMetricsUseCase.execute({
          campaignPublicId: campaignId,
          startDate: route.query.start_date,
          endDate: route.query.end_date,
        }),
        this.getDonationsSummaryUseCase.execute({
          campaignId,
          startDate: route.query.start_date,
          endDate: route.query.end_date,
        }),
        this.getTransferMetricsUseCase.execute({ campaignPublicId: campaignId }),
      ]);

    const fmt = (n: number) =>
      n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return {
      pending: paymentMetrics.pending,
      canceled: paymentMetrics.canceled,
      oneTimeDonations: donationsSummary.oneTimeDonationsAmount,
      recurringDonations: donationsSummary.recurringDonationsAmount,
      newRecurringDonors: donationsSummary.subscriptionsCreatedInPeriodActiveCount,
      withdrawalsMade: fmt(transferMetrics.withdrawalsMade),
      balanceAvailable: fmt(transferMetrics.balanceAvailable),
      averageTicket: donationsSummary.averageTicketPeriod,
    };
  }
}

export { GetCampaignMetricsModalController };
