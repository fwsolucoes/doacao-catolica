import type { ShalomMetricsSearchParams } from "~/app/search/shalomMetricsSearchParams";

type ShalomMetricsData = {
  receivedOnline: string;
  receivedOnlineFee: string;
  totalAvailable: string;
  pendingAvailability: string;
  receivedOffline: string;
  receivedOfflineFee: string;
  overdue: string;
  appliedFees: string;
  shalomTransfers: string;
  missionTransfers: string;
};

type ShalomMetricsGatewayDTO = {
  getShalomMetrics(
    campaignPublicId: string,
    searchParams: ShalomMetricsSearchParams,
  ): Promise<ShalomMetricsData>;
};

export type { ShalomMetricsGatewayDTO, ShalomMetricsData };
