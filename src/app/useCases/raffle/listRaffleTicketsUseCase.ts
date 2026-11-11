import { RaffleTicketSearchParams } from "~/app/search/raffleTicketSearchParams";
import type { RaffleGatewayDTO } from "~/domain/gateways/raffle";

const PAGE_LIMIT = 10;

type InputProps = {
  raffleId: string;
  page?: number;
  search?: string;
};

class ListRaffleTicketsUseCase {
  constructor(private gateway: RaffleGatewayDTO) {}

  async execute(input: InputProps) {
    const searchParams = new RaffleTicketSearchParams({
      page: input.page,
      filter: {
        search: input.search,
        per_page: PAGE_LIMIT,
      },
    });

    const result = await this.gateway.listRaffleTickets(
      input.raffleId,
      searchParams,
    );

    return {
      raffle: result.raffle.toJson(),
      tickets: result.tickets.toJson(),
    };
  }
}

export { ListRaffleTicketsUseCase };
