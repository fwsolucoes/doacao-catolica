import { SearchParams } from "../shared/searchParams";

type Filter = {
  month?: number;
  year?: number;
};

class DashboardPaymentMethodsSearchParams extends SearchParams<Filter> {}

export { DashboardPaymentMethodsSearchParams };
