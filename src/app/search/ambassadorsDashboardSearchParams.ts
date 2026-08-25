import { SearchParams } from "../shared/searchParams";

type AmbassadorsDashboardFilter = {
  project_id: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  min_indications?: string;
  max_indications?: string;
};

class AmbassadorsDashboardSearchParams extends SearchParams<AmbassadorsDashboardFilter> {}

export { AmbassadorsDashboardSearchParams };
