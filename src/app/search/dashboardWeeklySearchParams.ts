import { SearchParams } from "../shared/searchParams";

type Filter = {
  date?: string;
};

class DashboardWeeklySearchParams extends SearchParams<Filter> {}

export { DashboardWeeklySearchParams };
