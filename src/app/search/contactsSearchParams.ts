import { SearchParams } from "../shared/searchParams";

type Filter = { name?: string };

class ContactsSearchParams extends SearchParams<Filter> {}

export { ContactsSearchParams };
