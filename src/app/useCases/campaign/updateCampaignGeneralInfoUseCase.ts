import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  name: string;
  slug: string;
  status: boolean;
  published: boolean;
  startDate: string | null;
  endDate: string | null;
  phone: string | null;
  typeDonation: string;
  totalGoal: number | null;
  monthlyGoal: number | null;
  institutionName: string | null;
  cnpj: string | null;
  address: string | null;
};

class UpdateCampaignGeneralInfoUseCase {
  constructor(private campaignGateway: CampaignGatewayDTO) {}

  async execute(input: InputProps) {
    const { campaignId, token } = input;

    const campaign = await this.campaignGateway.getCampaign(campaignId, token);

    await this.campaignGateway.updateCampaignGeneralInfo(
      {
        campaignId,
        subAccountId: campaign.subAccountId,
        email: campaign.email,
        type: campaign.type,
        description: campaign.description,
        image: campaign.image,
        name: input.name,
        slug: input.slug,
        status: input.status,
        published: input.published,
        startDate: input.startDate,
        endDate: input.endDate,
        noEndDate: !input.endDate,
        phone: input.phone,
        typeDonation: input.typeDonation,
        totalGoal: input.totalGoal,
        monthlyGoal: input.monthlyGoal,
        institutionName: input.institutionName,
        cnpj: input.cnpj,
        address: input.address,
      },
      token,
    );

    return {
      toast: {
        message: "Campanha atualizada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignGeneralInfoUseCase };
