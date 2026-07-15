// src/domain/gateways/donor.ts
import type { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { Donor } from "../entities/donor";
import type { OneTimeDonor } from "../entities/oneTimeDonor";
import type { RecurringDonor } from "../entities/recurringDonor";

type CreateDonorInput = {
  accountId: number;
  name: string;
  cpf?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  projectId: string;
  token: string;
};

type DonorsSummary = {
  totalDonors: number;
  recurringDonors: number;
  oneTimeDonors: number;
  newDonorsThisMonth: number;
  newDonorsPreviousMonth: number;
  newDonorsVariationPercentage: number | null;
  totalRecurringAmount: number;
  averageDonationAmount: number;
};

type DonorGatewayDTO = {
  createDonor(input: CreateDonorInput): Promise<string>;
  listDonors(
    projectId: string,
    accountId: number,
    searchParams: DonorSearchParams,
    token: string,
  ): Promise<SearchResult<Donor>>;
  getDonorsSummary(campaignId: string): Promise<DonorsSummary>;
  listRecurringDonors(
    campaignId: string,
    searchParams: DonorSearchParams,
  ): Promise<SearchResult<RecurringDonor>>;
  listOneTimeDonors(
    campaignId: string,
    searchParams: DonorSearchParams,
  ): Promise<SearchResult<OneTimeDonor>>;
};

export type { DonorGatewayDTO, CreateDonorInput, DonorsSummary };
