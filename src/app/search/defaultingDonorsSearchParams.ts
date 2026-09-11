import { SearchParams } from "../shared/searchParams";

type Filter = {
  account_uuid: string;
  months: number;
};

class DefaultingDonorsSearchParams extends SearchParams<Filter> {}

export { DefaultingDonorsSearchParams };
