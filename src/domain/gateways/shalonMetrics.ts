import type { ShalonMetricsSearchParams } from "~/app/search/shalonMetricsSearchParams";

type ShalonMetricsData = {
  receivedOnline: string;
  receivedOnlineFee: string;
  totalAvailable: string;
  pendingAvailability: string;
  receivedOffline: string;
  receivedOfflineFee: string;
  overdue: string;
  appliedFees: string;
  shalonTransfers: string;
  missionTransfers: string;
};

type ShalonMetricsGatewayDTO = {
  getShalonMetrics(
    campaignPublicId: string,
    searchParams: ShalonMetricsSearchParams,
  ): Promise<ShalonMetricsData>;
};

export type { ShalonMetricsGatewayDTO, ShalonMetricsData };
