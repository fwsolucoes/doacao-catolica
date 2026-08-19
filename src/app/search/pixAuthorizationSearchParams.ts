import { SearchParams } from "../shared/searchParams";

type Filter = {
  status?: string;
  search?: string;
  order?: string;
  per_page: number;
};

class PixAuthorizationSearchParams extends SearchParams<Filter> {}

export { PixAuthorizationSearchParams };
