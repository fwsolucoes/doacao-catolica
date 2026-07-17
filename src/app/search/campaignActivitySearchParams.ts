import { SearchParams } from "../shared/searchParams";

type Filter = {
  month?: number;
  year?: number;
};

class CampaignActivitySearchParams extends SearchParams<Filter> {}

export { CampaignActivitySearchParams };
