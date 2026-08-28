import { SearchParams } from "../shared/searchParams";

type Filter = {
  search?: string;
  per_page?: number;
};

class CampaignSearchParams extends SearchParams<Filter> {}

export { CampaignSearchParams };
