import type { PaymentMetricsSearchParams } from "~/app/search/paymentMetricsSearchParams";
import type { PaymentsListSearchParams } from "~/app/search/paymentsListSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { Payment } from "../entities/payment";

type PaymentMetricsData = {
  receivedOnline: string;
  released: string;
  releasedAmount: number;
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
    searchParams: PaymentsListSearchParams,
  ): Promise<SearchResult<Payment>>;
};

export type { PaymentMetricsGatewayDTO, PaymentMetricsData };
