import type { DashboardWeeklySearchParams } from "~/app/search/dashboardWeeklySearchParams";

type DashboardWeeklyDay = {
  date: string;
  dayOfWeek: number;
  label: string;
  donationsCount: number;
  totalAmount: number;
};

type DashboardWeeklyData = {
  startDate: string;
  endDate: string;
  totalAmount: number;
  donationsCount: number;
  previousWeekAmount: number;
  growthPercentage: number | null;
  days: DashboardWeeklyDay[];
};

type DashboardWeeklyGatewayDTO = {
  getWeekly(
    accountUuid: string,
    searchParams: DashboardWeeklySearchParams,
  ): Promise<DashboardWeeklyData>;
};

export type {
  DashboardWeeklyGatewayDTO,
  DashboardWeeklyData,
  DashboardWeeklyDay,
};
