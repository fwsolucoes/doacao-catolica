import { SearchParams } from "../shared/searchParams";

type Filter = {
  limit?: number;
};

class DashboardRecentDonationsSearchParams extends SearchParams<Filter> {}

export { DashboardRecentDonationsSearchParams };
