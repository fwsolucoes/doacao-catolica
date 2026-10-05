import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
  date_type: string | undefined;
};

class PaymentMetricsSearchParams extends SearchParams<Filter> {}

export { PaymentMetricsSearchParams };
