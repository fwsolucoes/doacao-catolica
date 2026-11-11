import { SearchResult } from "~/app/shared/searchResult";
import type { Raffle } from "~/domain/entities/raffle";
import type { RaffleGatewayDTO } from "~/domain/gateways/raffle";

const PAGE_LIMIT = 10;

type InputProps = {
  accountReference: string;
  page?: number;
  search?: string;
  // known values: "active" | "inactive"
  status?: string;
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * O endpoint GET /raffles/account/{account_reference} não aceita filtros nem paginação,
 * então a busca por nome, o filtro de status e a paginação são aplicados aqui.
 */
class ListRafflesUseCase {
  constructor(private gateway: RaffleGatewayDTO) {}

  async execute(input: InputProps) {
    const raffles = await this.gateway.listRaffles(input.accountReference);

    const search = input.search ? normalize(input.search) : "";
    const filtered = raffles.filter((raffle: Raffle) => {
      if (search && !normalize(raffle.name).includes(search)) return false;
      if (input.status && raffle.status !== input.status) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_LIMIT));
    const page = Math.min(Math.max(1, input.page ?? 1), totalPages);
    const start = (page - 1) * PAGE_LIMIT;

    return new SearchResult({
      data: filtered.slice(start, start + PAGE_LIMIT),
      meta: { page, pageLimit: PAGE_LIMIT, totalItems: filtered.length },
    }).toJson();
  }
}

export { ListRafflesUseCase };
