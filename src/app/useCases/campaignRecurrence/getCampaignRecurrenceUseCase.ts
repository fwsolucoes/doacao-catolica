import { CampaignRecurrenceSearchParams } from "~/app/search/campaignRecurrenceSearchParams";
import type { CampaignRecurrenceGatewayDTO } from "~/domain/gateways/campaignRecurrence";

type InputProps = {
  campaignId: string;
  month?: number;
  year?: number;
};

class GetCampaignRecurrenceUseCase {
  constructor(private gateway: CampaignRecurrenceGatewayDTO) {}

  async execute({ campaignId, month, year }: InputProps) {
    const searchParams = new CampaignRecurrenceSearchParams({
      filter: { month, year },
    });

    return await this.gateway.getRecurrence(campaignId, searchParams);
  }
}

export { GetCampaignRecurrenceUseCase };
