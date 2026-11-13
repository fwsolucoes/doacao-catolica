import { SearchParams } from "../shared/searchParams";

type Filter = {
  /** Número exato ou nome do doador */
  search?: string;
  // known values: "active" | "canceled"
  status?: string;
  /** Paginação padrão do Laravel — `toExternal` geraria `pagesize` */
  per_page?: number;
};

class RaffleTicketSearchParams extends SearchParams<Filter> {}

export { RaffleTicketSearchParams };
