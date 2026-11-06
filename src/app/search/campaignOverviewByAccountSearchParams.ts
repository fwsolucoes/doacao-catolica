import { SearchParams } from "../shared/searchParams";

type Filter = {
  account_reference?: string;
  account_reference_2?: number;
  account_group_id?: string;
  month?: number;
  year?: number;
};

class CampaignOverviewByAccountSearchParams extends SearchParams<Filter> {}

export { CampaignOverviewByAccountSearchParams };
