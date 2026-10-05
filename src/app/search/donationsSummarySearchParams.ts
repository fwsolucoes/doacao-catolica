import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
  date_type: string | undefined;
};

class DonationsSummarySearchParams extends SearchParams<Filter> {}

export { DonationsSummarySearchParams };
