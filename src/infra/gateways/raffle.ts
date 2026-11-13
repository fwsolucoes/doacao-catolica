import type { RaffleTicketSearchParams } from "~/app/search/raffleTicketSearchParams";
import { SearchResult } from "~/app/shared/searchResult";
import { Raffle } from "~/domain/entities/raffle";
import { RaffleTicket } from "~/domain/entities/raffleTicket";
import type {
  RaffleGatewayDTO,
  RaffleInput,
  RaffleTicketsResult,
  UpdateRaffleInput,
} from "~/domain/gateways/raffle";
import { environmentVariables } from "~/main/config/environmentVariables";
import { HttpAdapter } from "../adapters/httpAdapter";
import { SchemaValidatorAdapter } from "../adapters/schemaValidatorAdapter";
import { donationApi } from "../http/donationApi";
import {
  type ExternalRaffle,
  externalRafflesSchema,
  externalRaffleTicketsSchema,
} from "../schemas/external/raffle";

function restoreRaffle(item: ExternalRaffle): Raffle {
  return Raffle.restore({
    id: item.uuid,
    accountReference: item.account_reference,
    name: item.name,
    enabled: item.enabled,
    ticketPrice: item.ticket_price,
    startNumber: item.start_number,
    endNumber: item.end_number,
    nextNumber: item.next_number,
    startsAt: item.starts_at,
    endsAt: item.ends_at,
    isOpen: item.is_open,
    summary: {
      totalNumbers: item.summary.total_numbers,
      sold: item.summary.sold,
      canceled: item.summary.canceled,
      reserved: item.summary.reserved,
      remaining: item.summary.remaining,
      available: item.summary.available,
      collected: item.summary.collected,
    },
  });
}

function toExternalBody(input: UpdateRaffleInput) {
  const body: Record<string, unknown> = {
    name: input.name,
    enabled: input.enabled,
    ticket_price: input.ticketPrice,
    start_number: input.startNumber,
    end_number: input.endNumber,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
  };

  // campos travados após a primeira venda não são enviados
  return Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== undefined),
  );
}

class RaffleGateway implements RaffleGatewayDTO {
  private headers = { "api-key": environmentVariables.API_KEY_DONATION };

  async listRaffles(accountReference: string): Promise<Raffle[]> {
    const apiResponse = await donationApi.get(
      `/api/raffles/account/${accountReference}`,
      { headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const data = new SchemaValidatorAdapter(externalRafflesSchema).validate(
      apiResponse.response,
    );

    return data.data.map(restoreRaffle);
  }

  async createRaffle(accountReference: string, input: RaffleInput): Promise<void> {
    const apiResponse = await donationApi.post(
      `/api/raffles/account/${accountReference}`,
      { body: toExternalBody(input), headers: this.headers },
    );

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async updateRaffle(raffleId: string, input: UpdateRaffleInput): Promise<void> {
    const apiResponse = await donationApi.put(`/api/raffles/${raffleId}`, {
      body: toExternalBody(input),
      headers: this.headers,
    });

    if (!apiResponse.success && apiResponse.status === 404) {
      throw HttpAdapter.notFound(apiResponse.message);
    }

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);
  }

  async listRaffleTickets(
    raffleId: string,
    searchParams: RaffleTicketSearchParams,
  ): Promise<RaffleTicketsResult> {
    let url = `/api/raffles/${raffleId}/tickets`;
    url += searchParams.toExternal(["pageLimit"]);

    const apiResponse = await donationApi.get(url, { headers: this.headers });

    if (!apiResponse.success && apiResponse.status === 404) {
      throw HttpAdapter.notFound(apiResponse.message);
    }

    if (!apiResponse.success) throw HttpAdapter.badGateway(apiResponse.message);

    const { data } = new SchemaValidatorAdapter(
      externalRaffleTicketsSchema,
    ).validate(apiResponse.response);

    return {
      raffle: restoreRaffle(data.raffle),
      tickets: new SearchResult({
        data: data.tickets.data.map((item) =>
          RaffleTicket.restore({
            id: item.uuid,
            number: item.number,
            status: item.status,
            customerName: item.customer.name,
            createdAt: item.created_at,
          }),
        ),
        meta: {
          page: data.tickets.current_page,
          pageLimit: data.tickets.per_page,
          totalItems: data.tickets.total,
        },
      }),
    };
  }
}

export { RaffleGateway };
