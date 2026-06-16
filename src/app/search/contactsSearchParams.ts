import { SearchParams } from "../shared/searchParams";

type Filter = { name?: string; status?: string; accountId?: string };

class ContactsSearchParams extends SearchParams<Filter> {}

export { ContactsSearchParams };
