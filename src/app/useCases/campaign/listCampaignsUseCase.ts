import { CampaignSearchParams } from "~/app/search/campaignSearchParams";
import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  page?: number | null;
  search?: string | null;
  token: string;
};

class ListCampaignsUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    const { page, search, token } = input;
    const searchParams = new CampaignSearchParams({
      page,
      filter: { search: search ?? undefined, per_page: 20 },
    });

    const campaigns = await this.campaignGateway.listCampaigns(
      searchParams,
      token,
    );

    return campaigns.toJson();
  }
}

export { ListCampaignsUseCase };
