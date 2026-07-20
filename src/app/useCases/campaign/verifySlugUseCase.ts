import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  slug: string;
  token: string;
};

class VerifySlugUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute({ slug, token }: InputProps) {
    return await this.campaignGateway.verifySlug(slug, token);
  }
}

export { VerifySlugUseCase };
