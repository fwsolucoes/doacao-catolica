import type { CampaignGatewayDTO } from "~/domain/gateways/campaign";
import type { DonationAccountGatewayDTO } from "~/domain/gateways/donationAccount";

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
  category: string | null;
};

class UpdateCampaignGeneralInfoUseCase {
  constructor(
    private campaignGateway: CampaignGatewayDTO,
    private donationAccountGateway: DonationAccountGatewayDTO,
  ) {}

  async execute(input: InputProps) {
    const { campaignId, token } = input;

    const [campaign] = await Promise.all([
      this.campaignGateway.getCampaign(campaignId, token),
      this.campaignGateway.updateCampaignWithDetails(
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
          projectCategoryId: input.category,
        },
        token,
      ),
    ]);

    const accountUuid = campaign.apiDonationPublicId ?? campaign.id;
    await this.donationAccountGateway.updateGoals(accountUuid, {
      totalGoal: input.totalGoal,
      monthlyGoal: input.monthlyGoal,
    });

    return {
      toast: {
        message: "Campanha atualizada com sucesso!",
        type: "success" as const,
      },
    };
  }
}

export { UpdateCampaignGeneralInfoUseCase };
