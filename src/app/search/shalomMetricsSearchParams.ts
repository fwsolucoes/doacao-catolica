import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
  date_type: string;
};

class ShalomMetricsSearchParams extends SearchParams<Filter> {}

export { ShalomMetricsSearchParams };
