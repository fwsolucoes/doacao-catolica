import type { CampaignActivitySearchParams } from "~/app/search/campaignActivitySearchParams";

type RecentDonation = {
  paymentUuid: string;
  customerName: string;
  customerReference: string;
  paymentMethod: string;
  status: string;
  origin: string;
  amount: number;
  paidAt: string;
};

type TopDonor = {
  customerUuid: string;
  customerReference: string;
  customerName: string;
  donationsCount: number;
  totalAmount: number;
};

type CampaignActivityData = {
  recentDonations: RecentDonation[];
  topDonors: TopDonor[];
};

type CampaignActivityGatewayDTO = {
  getActivity(
    campaignId: string,
    searchParams: CampaignActivitySearchParams,
  ): Promise<CampaignActivityData>;
};

export type {
  CampaignActivityGatewayDTO,
  CampaignActivityData,
  RecentDonation,
  TopDonor,
};
