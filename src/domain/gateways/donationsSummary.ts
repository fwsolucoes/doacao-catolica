import type { DonationsSummarySearchParams } from "~/app/search/donationsSummarySearchParams";
import type { DonationsSummaryJson } from "../entities/donationsSummary";

type DonationsSummaryGatewayDTO = {
  getDonationsSummary(
    campaignId: string,
    searchParams: DonationsSummarySearchParams,
  ): Promise<DonationsSummaryJson>;
};

export type { DonationsSummaryGatewayDTO };
