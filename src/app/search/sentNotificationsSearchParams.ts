import { SearchParams } from "../shared/searchParams";

type Filter = {
  per_page: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  notification_type?: string;
  log_type?: string;
};

class SentNotificationsSearchParams extends SearchParams<Filter> {}

export { SentNotificationsSearchParams };
