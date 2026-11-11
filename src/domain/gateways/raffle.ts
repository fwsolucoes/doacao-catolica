import type { RaffleTicketSearchParams } from "~/app/search/raffleTicketSearchParams";
import type { SearchResult } from "~/app/shared/searchResult";
import type { Raffle } from "../entities/raffle";
import type { RaffleTicket } from "../entities/raffleTicket";

type RaffleInput = {
  name: string;
  enabled: boolean;
  ticketPrice: number;
  startNumber: number;
  endNumber: number;
  /** Formato Y-m-d H:i:s */
  startsAt: string;
  /** Formato Y-m-d H:i:s, posterior ao startsAt */
  endsAt: string;
};

/** Depois da primeira venda, ticketPrice e startNumber travam — por isso são opcionais. */
type UpdateRaffleInput = Partial<RaffleInput>;

type RaffleTicketsResult = {
  raffle: Raffle;
  tickets: SearchResult<RaffleTicket>;
};

type RaffleGatewayDTO = {
  listRaffles(accountReference: string): Promise<Raffle[]>;
  createRaffle(accountReference: string, input: RaffleInput): Promise<void>;
  updateRaffle(raffleId: string, input: UpdateRaffleInput): Promise<void>;
  listRaffleTickets(
    raffleId: string,
    searchParams: RaffleTicketSearchParams,
  ): Promise<RaffleTicketsResult>;
};

export type {
  RaffleGatewayDTO,
  RaffleInput,
  RaffleTicketsResult,
  UpdateRaffleInput,
};
