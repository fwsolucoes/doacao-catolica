import type { DonationEvolutionSearchParams } from "~/app/search/donationEvolutionSearchParams";

type DonationEvolutionDay = {
  day: number;
  date: string;
  oneTimeAmount: number;
  recurringAmount: number;
  totalAmount: number;
};

type DonationEvolutionData = {
  days: DonationEvolutionDay[];
};

type DonationEvolutionGatewayDTO = {
  getEvolution(
    campaignId: string,
    searchParams: DonationEvolutionSearchParams,
  ): Promise<DonationEvolutionData>;
};

export type {
  DonationEvolutionGatewayDTO,
  DonationEvolutionData,
  DonationEvolutionDay,
};
