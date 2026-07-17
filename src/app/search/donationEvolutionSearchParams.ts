import { SearchParams } from "../shared/searchParams";

type Filter = {
  month?: number;
  year?: number;
};

class DonationEvolutionSearchParams extends SearchParams<Filter> {}

export { DonationEvolutionSearchParams };
