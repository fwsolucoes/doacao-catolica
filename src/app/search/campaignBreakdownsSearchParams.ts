import { SearchParams } from "../shared/searchParams";

type Filter = {
  month?: number;
  year?: number;
};

class CampaignBreakdownsSearchParams extends SearchParams<Filter> {}

export { CampaignBreakdownsSearchParams };
