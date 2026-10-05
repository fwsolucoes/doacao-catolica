import { DonationsSummarySearchParams } from "~/app/search/donationsSummarySearchParams";
import type { DonationsSummaryGatewayDTO } from "~/domain/gateways/donationsSummary";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignId: string;
  startDate?: string;
  endDate?: string;
  dateType?: string;
};

class GetDonationsSummaryUseCase {
  constructor(private gateway: DonationsSummaryGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignId, startDate, endDate, dateType } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new DonationsSummarySearchParams({
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
        date_type: dateType === "due" ? undefined : (dateType ?? "donation"),
      },
    });

    return this.gateway.getDonationsSummary(campaignId, searchParams);
  }
}

export { GetDonationsSummaryUseCase };
