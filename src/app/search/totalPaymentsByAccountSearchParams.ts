import { SearchParams } from "../shared/searchParams";

type Filter = {
  account_reference_2: number;
  start_date: string;
  end_date: string;
  date_type?: string;
};

class TotalPaymentsByAccountSearchParams extends SearchParams<Filter> {}

export { TotalPaymentsByAccountSearchParams };
