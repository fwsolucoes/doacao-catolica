import { SearchParams } from "../shared/searchParams";

type Filter = {
  account_uuid?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
  search?: string;
  per_page?: number;
};

class RegistrationsWithoutDonationsSearchParams extends SearchParams<Filter> {}

export { RegistrationsWithoutDonationsSearchParams };
