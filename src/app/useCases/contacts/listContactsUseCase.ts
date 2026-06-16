import type { ContactDalDTO } from "~/domain/dal/contact";
import type { Contact } from "~/domain/views/contact";
import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  name?: string;
};

class ListContactsUseCase {
  constructor(
    private contactDal: ContactDalDTO,
    private campaignGateway: CampaignGatewayDTO,
  ) {}

  async execute(input: InputProps, token: string): Promise<Contact[]> {
    const { campaignId, name } = input;
    const campaign = await this.campaignGateway.getCampaign(campaignId, token);
    return this.contactDal.listContacts(String(campaign.accountId), token, name);
  }
}

export { ListContactsUseCase };
