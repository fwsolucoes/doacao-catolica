import type { PaymentMetricsSearchParams } from "~/app/search/paymentMetricsSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { Payment } from "../entities/payment";

type PaymentMetricsData = {
  receivedOnline: string;
  released: string;
  awaitingRelease: string;
  pending: string;
  receivedOffline: string;
  overdue: string;
  canceled: string;
  appliedFees: string;
};

type PaymentMetricsGatewayDTO = {
  getPaymentMetrics(
    campaignPublicId: string,
    searchParams: PaymentMetricsSearchParams,
  ): Promise<PaymentMetricsData>;
  listPayments(
    campaignPublicId: string,
    searchParams: PaymentMetricsSearchParams,
  ): Promise<SearchResult<Payment>>;
};

export type { PaymentMetricsGatewayDTO, PaymentMetricsData };
