type GetPaymentMetricsParams = {
  subAccountId: string;
  startDate: string;
  endDate: string;
  token: string;
};

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
  getPaymentMetrics: (params: GetPaymentMetricsParams) => Promise<PaymentMetricsData>;
};

export type { PaymentMetricsGatewayDTO, GetPaymentMetricsParams, PaymentMetricsData };
