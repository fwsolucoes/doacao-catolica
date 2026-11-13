import { z } from "zod";

const externalRaffleSummarySchema = z.object({
  total_numbers: z.number(),
  sold: z.number(),
  canceled: z.number(),
  reserved: z.number(),
  remaining: z.number(),
  available: z.number(),
  collected: z.number(),
});

const externalRaffleSchema = z.object({
  uuid: z.uuid(),
  account_reference: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  ticket_price: z.number(),
  start_number: z.number(),
  end_number: z.number(),
  next_number: z.number(),
  // "Y-m-d H:i:s", ex.: "2026-11-07 00:00:00"
  starts_at: z.string(),
  ends_at: z.string(),
  is_open: z.boolean(),
  summary: externalRaffleSummarySchema,
  created_at: z.string(),
  updated_at: z.string(),
});

const externalRafflesSchema = z.object({
  data: z.array(externalRaffleSchema),
});

const externalRaffleTicketSchema = z.object({
  uuid: z.uuid(),
  // a API devolve o número como string, ex.: "25000"
  number: z.string(),
  // known values: "active" | "canceled"
  status: z.string(),
  // "Y-m-d H:i:s"
  canceled_at: z.string().nullable(),
  created_at: z.string(),
  customer: z.object({
    name: z.string(),
    reference: z.string(),
    // nulo para doadores sem e-mail cadastrado
    email: z.string().nullable(),
  }),
  payment: z.object({
    uuid: z.uuid(),
    // known values: "pix" | ...
    type: z.string(),
    // known values: "received" | ...
    status: z.string(),
    amount: z.number(),
  }),
  purchase_uuid: z.uuid(),
  purchase_amount: z.number(),
});

// Paginação padrão do Laravel — só os campos usados são validados
const externalRaffleTicketsSchema = z.object({
  data: z.object({
    raffle: externalRaffleSchema,
    tickets: z.object({
      current_page: z.number(),
      data: z.array(externalRaffleTicketSchema),
      per_page: z.number(),
      last_page: z.number(),
      total: z.number(),
    }),
  }),
});

type ExternalRaffle = z.infer<typeof externalRaffleSchema>;
type ExternalRaffleTicket = z.infer<typeof externalRaffleTicketSchema>;

export {
  externalRaffleSchema,
  externalRafflesSchema,
  externalRaffleTicketsSchema,
  type ExternalRaffle,
  type ExternalRaffleTicket,
};
