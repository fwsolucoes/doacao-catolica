import { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";
import type { DonorGatewayDTO } from "~/domain/gateways/donor";

type InputProps = {
  campaignId: string;
  page?: number | null;
  search?: string;
  token: string;
};

class ListDonorsByCampaignUseCase {
  constructor(
    private campaignGateway: CampaignGatewayDTO,
    private donorGateway: DonorGatewayDTO,
  ) {}

  async execute(input: InputProps) {
    const { campaignId, page, search, token } = input;

    const campaign = await this.campaignGateway.getCampaign(campaignId, token);

    const searchParams = new DonorSearchParams({
      page: page ?? 1,
      filter: { search },
    });

    const result = await this.donorGateway.listDonors(
      campaignId,
      campaign.accountId,
      searchParams,
      token,
    );

    return result.toJson();
  }
}

export { ListDonorsByCampaignUseCase };
