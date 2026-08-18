import { AnnualEvolutionSearchParams } from "~/app/search/annualEvolutionSearchParams";
import type { AnnualEvolutionGatewayDTO } from "~/domain/gateways/annualEvolution";

type InputProps = {
  accountUuid: string;
  year?: number;
};

class GetAnnualEvolutionUseCase {
  constructor(private gateway: AnnualEvolutionGatewayDTO) {}

  async execute({ accountUuid, year }: InputProps) {
    const searchParams = new AnnualEvolutionSearchParams({
      filter: { year },
    });

    return await this.gateway.getAnnualEvolution(accountUuid, searchParams);
  }
}

export { GetAnnualEvolutionUseCase };
