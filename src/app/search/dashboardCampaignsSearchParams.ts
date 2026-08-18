import { SearchParams } from "../shared/searchParams";

type Filter = {
  month?: number;
  year?: number;
  limit?: number;
};

class DashboardCampaignsSearchParams extends SearchParams<Filter> {}

export { DashboardCampaignsSearchParams };
