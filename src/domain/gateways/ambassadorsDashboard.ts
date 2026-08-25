import type { AmbassadorJson } from "../entities/ambassador";
import type { AmbassadorsDashboardSearchParams } from "~/app/search/ambassadorsDashboardSearchParams";

type AmbassadorsDashboardPreviousPeriod = {
  startDate: string;
  endDate: string;
  periodIndications: number;
  variationPercent: number | null;
};

type AmbassadorsDashboardSummary = {
  totalAmbassadors: number;
  periodIndications: number;
  previousPeriod: AmbassadorsDashboardPreviousPeriod;
  totalIndications: number;
  totalRecurringAmount: number;
  totalRaisedAmount: number;
};

type AmbassadorsDashboardIndicationByDay = {
  date: string;
  label: string;
  totalIndications: number;
  totalAmount: number;
};

type AmbassadorsDashboardAmountRange = {
  key: string;
  label: string;
  totalPayments: number;
  totalAmount: number;
};

type AmbassadorsDashboardPaymentMethod = {
  type: string;
  label: string;
  totalPayments: number;
  totalAmount: number;
  percentage: number;
};

type AmbassadorsDashboardCharts = {
  indicationsByDay: AmbassadorsDashboardIndicationByDay[];
  donationAmountRanges: AmbassadorsDashboardAmountRange[];
  paymentMethods: AmbassadorsDashboardPaymentMethod[];
};

type AmbassadorsDashboardPagination = {
  currentPage: number;
  perPage: number;
  from: number;
  to: number;
  total: number;
  lastPage: number;
};

type AmbassadorsDashboardData = {
  summary: AmbassadorsDashboardSummary;
  charts: AmbassadorsDashboardCharts;
  ambassadors: AmbassadorJson[];
  pagination: AmbassadorsDashboardPagination;
};

type AmbassadorsDashboardGatewayDTO = {
  getDashboard(
    campaignId: string,
    searchParams: AmbassadorsDashboardSearchParams,
  ): Promise<AmbassadorsDashboardData>;
};

export type {
  AmbassadorsDashboardGatewayDTO,
  AmbassadorsDashboardData,
  AmbassadorsDashboardSummary,
  AmbassadorsDashboardCharts,
  AmbassadorsDashboardPagination,
};
