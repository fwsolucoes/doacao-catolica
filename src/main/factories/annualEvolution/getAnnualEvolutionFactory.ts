import { GetAnnualEvolutionUseCase } from "~/app/useCases/annualEvolution/getAnnualEvolutionUseCase";
import { AnnualEvolutionGateway } from "~/infra/gateways/annualEvolution";

const annualEvolutionGateway = new AnnualEvolutionGateway();
const getAnnualEvolutionUseCase = new GetAnnualEvolutionUseCase(
  annualEvolutionGateway,
);

const getAnnualEvolution = {
  handle: (accountUuid: string, year?: number) =>
    getAnnualEvolutionUseCase.execute({ accountUuid, year }),
};

export { getAnnualEvolution };
