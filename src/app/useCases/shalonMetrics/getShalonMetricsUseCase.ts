import type { ShalonMetricsGatewayDTO, ShalonMetricsData } from "~/domain/gateways/shalonMetrics";
import { ShalonMetricsSearchParams } from "~/app/search/shalonMetricsSearchParams";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignPublicId: string;
  startDate?: string;
  endDate?: string;
};

class GetShalonMetricsUseCase {
  constructor(private shalonMetricsGateway: ShalonMetricsGatewayDTO) {}

  async execute(input: InputProps): Promise<ShalonMetricsData> {
    const { campaignPublicId, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new ShalonMetricsSearchParams({
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
        date_type: "paid",
      },
    });

    return this.shalonMetricsGateway.getShalonMetrics(campaignPublicId, searchParams);
  }
}

export { GetShalonMetricsUseCase };
