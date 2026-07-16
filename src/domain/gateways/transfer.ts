import type { TransferSearchParams } from "~/app/search/transferSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { Transfer } from "../entities/transfer";

type TransferMetricsData = {
  totalReceived: number;
  balanceAvailable: number;
  withdrawalsMade: number;
};

type TransferGatewayDTO = {
  getTransferMetrics(campaignPublicId: string): Promise<TransferMetricsData>;
  listTransfers(
    campaignPublicId: string,
    searchParams: TransferSearchParams,
  ): Promise<SearchResult<Transfer>>;
};

export type { TransferGatewayDTO, TransferMetricsData };
