import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date?: string;
  end_date?: string;
};

class TransferSearchParams extends SearchParams<Filter> {}

export { TransferSearchParams };
