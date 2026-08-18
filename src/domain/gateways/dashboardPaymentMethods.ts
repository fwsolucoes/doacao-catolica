import type { DashboardPaymentMethodsSearchParams } from "~/app/search/dashboardPaymentMethodsSearchParams";

type DashboardPaymentMethod = {
  paymentMethod: string;
  donationsCount: number;
  totalAmount: number;
  percentage: number;
};

type DashboardPaymentMethodsData = {
  totalAmount: number;
  donationsCount: number;
  paymentMethods: DashboardPaymentMethod[];
};

type DashboardPaymentMethodsGatewayDTO = {
  getPaymentMethods(
    accountUuid: string,
    searchParams: DashboardPaymentMethodsSearchParams,
  ): Promise<DashboardPaymentMethodsData>;
};

export type {
  DashboardPaymentMethodsGatewayDTO,
  DashboardPaymentMethodsData,
  DashboardPaymentMethod,
};
