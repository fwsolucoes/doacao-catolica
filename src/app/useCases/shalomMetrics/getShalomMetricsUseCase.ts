import type { ShalomMetricsGatewayDTO, ShalomMetricsData } from "~/domain/gateways/shalomMetrics";
import { ShalomMetricsSearchParams } from "~/app/search/shalomMetricsSearchParams";
import { getMonthDates } from "~/lib/getMonthDates";

type InputProps = {
  campaignPublicId: string;
  startDate?: string;
  endDate?: string;
};

class GetShalomMetricsUseCase {
  constructor(private shalomMetricsGateway: ShalomMetricsGatewayDTO) {}

  async execute(input: InputProps): Promise<ShalomMetricsData> {
    const { campaignPublicId, startDate, endDate } = input;
    const { firstDayOfMonth, lastDayOfMonth } = getMonthDates(0);

    const searchParams = new ShalomMetricsSearchParams({
      filter: {
        start_date: startDate ?? firstDayOfMonth,
        end_date: endDate ?? lastDayOfMonth,
        date_type: "paid",
      },
    });

    return this.shalomMetricsGateway.getShalomMetrics(campaignPublicId, searchParams);
  }
}

export { GetShalomMetricsUseCase };
