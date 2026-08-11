import { DonationsSummarySearchParams } from "~/app/search/donationsSummarySearchParams";
import type { DonationsSummaryGatewayDTO } from "~/domain/gateways/donationsSummary";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignId: string;
  startDate?: string;
  endDate?: string;
};

class GetDonationsSummaryUseCase {
  constructor(private gateway: DonationsSummaryGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignId, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new DonationsSummarySearchParams({
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
      },
    });

    return this.gateway.getDonationsSummary(campaignId, searchParams);
  }
}

export { GetDonationsSummaryUseCase };
