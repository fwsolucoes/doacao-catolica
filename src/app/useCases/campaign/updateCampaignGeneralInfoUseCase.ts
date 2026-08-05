import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";

type InputProps = {
  campaignId: string;
  token: string;
  name: string;
  slug: string;
  status: boolean;
  visibleInMarketplace: boolean;
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

    await this.campaignGateway.updateCampaignWithDetails(
      {
        campaignId,
        name: input.name,
        slug: input.slug,
        status: input.status,
        visibleInMarketplace: input.visibleInMarketplace,
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
