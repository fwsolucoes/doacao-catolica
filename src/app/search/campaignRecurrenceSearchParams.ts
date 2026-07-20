import { SearchParams } from "../shared/searchParams";

type Filter = {
  month?: number;
  year?: number;
};

class CampaignRecurrenceSearchParams extends SearchParams<Filter> {}

export { CampaignRecurrenceSearchParams };
