import { SearchParams } from "../shared/searchParams";

type Filter = {
  date_type: string;
  start_date: string;
  end_date: string;
};

class FinancialSummarySearchParams extends SearchParams<Filter> {}

export { FinancialSummarySearchParams };
