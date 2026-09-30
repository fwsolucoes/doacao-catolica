import { SearchParams } from "../shared/searchParams";

type Filter = {
  account_uuid?: string;
  start_month: string;
  end_month: string;
  project_id?: string;
  project_account_id?: string;
  search?: string;
  name?: string;
  cpf?: string;
};

class MonthlyDonorsSearchParams extends SearchParams<Filter> {}

export { MonthlyDonorsSearchParams };
