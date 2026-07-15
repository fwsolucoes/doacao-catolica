import { SearchParams } from "../shared/searchParams";

type Filter = {
  search?: string;
  start_date?: string;
  end_date?: string;
  payment_method?: string;
  status?: string;
  pay_day?: string;
};

class DonorSearchParams extends SearchParams<Filter> {}

export { DonorSearchParams };
