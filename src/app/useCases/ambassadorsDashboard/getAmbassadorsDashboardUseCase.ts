import { AmbassadorsDashboardSearchParams } from "~/app/search/ambassadorsDashboardSearchParams";
import type { AmbassadorsDashboardGatewayDTO } from "~/domain/gateways/ambassadorsDashboard";

type InputProps = {
  campaignId: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  search?: string;
  minIndications?: string;
  maxIndications?: string;
};

class GetAmbassadorsDashboardUseCase {
  constructor(private gateway: AmbassadorsDashboardGatewayDTO) {}

  async execute(input: InputProps) {
    const searchParams = new AmbassadorsDashboardSearchParams({
      page: input.page ? Number(input.page) : 1,
      filter: {
        project_id: input.campaignId,
        start_date: input.startDate,
        end_date: input.endDate,
        search: input.search,
        min_indications: input.minIndications,
        max_indications: input.maxIndications,
      },
    });

    return await this.gateway.getDashboard(input.campaignId, searchParams);
  }
}

export { GetAmbassadorsDashboardUseCase };
