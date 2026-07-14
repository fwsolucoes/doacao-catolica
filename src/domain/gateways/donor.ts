// src/domain/gateways/donor.ts
import type { DonorSearchParams } from "~/app/search/donorSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { Donor } from "../entities/donor";

type RecurringDonor = {
  subscriptionUuid: string;
  customerUuid: string;
  customerReference: string;
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  donationsLast12Months: number;
  lastDonationAt: string | null;
  status: boolean;
  activeNotification: boolean;
  amount: number;
  payDay: number;
  paymentMethod: "automatic_pix" | "pix" | "bank_slip" | "credit_card";
  registeredAt: string;
};

type ListRecurringDonorsResult = {
  data: RecurringDonor[];
  meta: { page: number; totalItems: number; totalPages: number };
};

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
  ): Promise<ListRecurringDonorsResult>;
};

export type {
  DonorGatewayDTO,
  CreateDonorInput,
  DonorsSummary,
  RecurringDonor,
  ListRecurringDonorsResult,
};
