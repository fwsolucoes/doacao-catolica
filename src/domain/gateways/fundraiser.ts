import { SearchResult } from "~/app/shared/searchResult";
import type { Fundraiser } from "../entities/fundraiser";

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
  createFundraiser: (
    input: CreateFundraiserInput,
    token: string,
  ) => Promise<void>;
  cancelInviteFundraiser: (id: string, token: string) => Promise<void>;
  resendInviteFundraiser: (id: string, token: string) => Promise<void>;
  removeFundraiser: (id: string, token: string) => Promise<void>;
};

export type { CreateFundraiserInput, FundraiserGatewayDTO };
