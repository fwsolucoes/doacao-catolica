import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
};

class DonationsSummarySearchParams extends SearchParams<Filter> {}

export { DonationsSummarySearchParams };
