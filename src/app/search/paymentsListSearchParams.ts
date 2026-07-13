import { SearchParams } from "../shared/searchParams";

type Filter = {
  start_date: string;
  end_date: string;
  per_page: number;
  date_type?: string;
  origin?: string;
  type?: string;
  status?: string;
  notified_email?: string;
  notified_whatsapp?: string;
  search?: string;
  customer_reference?: string;
};

class PaymentsListSearchParams extends SearchParams<Filter> {}

export { PaymentsListSearchParams };
