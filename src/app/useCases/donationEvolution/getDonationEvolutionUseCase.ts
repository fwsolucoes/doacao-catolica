import { DonationEvolutionSearchParams } from "~/app/search/donationEvolutionSearchParams";
import type { DonationEvolutionGatewayDTO } from "~/domain/gateways/donationEvolution";

type InputProps = {
  campaignId: string;
  month?: number;
  year?: number;
};

class GetDonationEvolutionUseCase {
  constructor(private gateway: DonationEvolutionGatewayDTO) {}

  async execute({ campaignId, month, year }: InputProps) {
    const searchParams = new DonationEvolutionSearchParams({
      filter: { month, year },
    });

    return await this.gateway.getEvolution(campaignId, searchParams);
  }
}

export { GetDonationEvolutionUseCase };
