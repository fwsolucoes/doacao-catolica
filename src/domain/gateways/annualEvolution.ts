import type { AnnualEvolutionSearchParams } from "~/app/search/annualEvolutionSearchParams";

type AnnualEvolutionMonth = {
  month: number;
  monthKey: string;
  label: string;
  donationsCount: number;
  totalAmount: number;
  goalAmount: number | null;
  goalProgressPercentage: number | null;
};

type AnnualEvolutionData = {
  year: number;
  monthlyGoal: number | null;
  periodGoal: number | null;
  totalAmount: number;
  months: AnnualEvolutionMonth[];
};

type AnnualEvolutionGatewayDTO = {
  getAnnualEvolution(
    accountUuid: string,
    searchParams: AnnualEvolutionSearchParams,
  ): Promise<AnnualEvolutionData>;
};

export type {
  AnnualEvolutionGatewayDTO,
  AnnualEvolutionData,
  AnnualEvolutionMonth,
};
