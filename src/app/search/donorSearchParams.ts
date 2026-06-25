import { SearchParams } from "../shared/searchParams";

type Filter = { search?: string };

class DonorSearchParams extends SearchParams<Filter> {}

export { DonorSearchParams };
