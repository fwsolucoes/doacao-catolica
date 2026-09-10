import type { CampaignSelectDalDTO } from "~/domain/dal/campaignSelect";

class ListCampaignSelectUseCase {
  constructor(private campaignSelectDal: CampaignSelectDalDTO) {}

  async execute(token: string) {
    const campaigns = await this.campaignSelectDal.listAll(token);
    return campaigns.map((campaign) => campaign.toJson());
  }
}

export { ListCampaignSelectUseCase };
