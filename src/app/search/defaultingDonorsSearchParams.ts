import { SearchParams } from "../shared/searchParams";

type Filter = {
  account_uuid?: string;
  months: number;
  reference_2?: string;
};

class DefaultingDonorsSearchParams extends SearchParams<Filter> {}

export { DefaultingDonorsSearchParams };
