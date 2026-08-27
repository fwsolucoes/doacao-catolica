import { SearchParams } from "../shared/searchParams";

type Filter = {
  search?: string;
};

class CampaignSearchParams extends SearchParams<Filter> {}

export { CampaignSearchParams };
