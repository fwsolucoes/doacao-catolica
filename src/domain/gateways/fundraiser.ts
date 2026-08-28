import { SearchResult } from "~/app/shared/searchResult";
import type { Fundraiser } from "../entities/fundraiser";
import type { FundraiserDetails } from "../entities/fundraiserDetails";

type CreateFundraiserInput = {
  projectId: string;
  userEmail: string;
  percentageCommission: number | null;
  code: string;
};

type FundraiserGatewayDTO = {
  listFundraisers: (
    campaignId: string,
    token: string,
  ) => Promise<SearchResult<Fundraiser>>;
  listActiveFundraisers: (
    campaignId: string,
    token: string,
    page: number,
    search?: string,
  ) => Promise<SearchResult<Fundraiser>>;
  createFundraiser: (
    input: CreateFundraiserInput,
    token: string,
  ) => Promise<void>;
  cancelInviteFundraiser: (id: string, token: string) => Promise<void>;
  resendInviteFundraiser: (id: string, token: string) => Promise<void>;
  removeFundraiser: (id: string, token: string) => Promise<void>;
  getFundraiserDetails: (id: string) => Promise<FundraiserDetails>;
};

export type { CreateFundraiserInput, FundraiserGatewayDTO };
