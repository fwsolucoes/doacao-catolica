// src/domain/gateways/donor.ts
import type { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { Donor } from "../entities/donor";

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

type DonorGatewayDTO = {
  createDonor(input: CreateDonorInput): Promise<string>;
  listDonors(
    projectId: string,
    accountId: number,
    searchParams: DonorSearchParams,
    token: string,
  ): Promise<SearchResult<Donor>>;
};

export type { DonorGatewayDTO, CreateDonorInput };
