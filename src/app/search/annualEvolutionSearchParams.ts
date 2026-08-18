import { SearchParams } from "../shared/searchParams";

type Filter = {
  year?: number;
};

class AnnualEvolutionSearchParams extends SearchParams<Filter> {}

export { AnnualEvolutionSearchParams };
