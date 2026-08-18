import type { DashboardRecentDonationsSearchParams } from "~/app/search/dashboardRecentDonationsSearchParams";

type RecentDonation = {
  paymentUuid: string;
  customerName: string;
  customerReference: string;
  customerInitials: string;
  campaignName: string;
  accountReference: string;
  paymentMethod: string;
  status: string;
  origin: string;
  amount: number;
  paidAt: string;
  elapsed: string;
};

type DashboardRecentDonationsData = {
  recentDonations: RecentDonation[];
};

type DashboardRecentDonationsGatewayDTO = {
  getRecentDonations(
    accountUuid: string,
    searchParams: DashboardRecentDonationsSearchParams,
  ): Promise<DashboardRecentDonationsData>;
};

export type {
  DashboardRecentDonationsGatewayDTO,
  DashboardRecentDonationsData,
  RecentDonation,
};
