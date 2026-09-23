import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
  date_type: string;
};

class PaymentMetricsSearchParams extends SearchParams<Filter> {}

export { PaymentMetricsSearchParams };
