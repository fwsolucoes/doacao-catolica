import { z } from "zod";

const oneTimeDonorsResponseSchema = z.object({
  data: z.object({
    current_page: z.number(),
    data: z.array(
      z.object({
        transfer_uuid: z.string(),
        customer: z.object({
          uuid: z.string(),
          reference: z.string(),
          name: z.string(),
          cpf_cnpj: z.string().nullable(),
          email: z.string().nullable(),
          phone: z.string().nullable(),
        }),
        registered_at: z.string(),
        is_recurring: z.boolean(),
        recurring_since: z.string().nullable(),
        amount: z.number(),
        // known values: "pix" | "bank_slip" | "credit_card"
        payment_method: z.string(),
        last_donation_at: z.string().nullable(),
      }),
    ),
    per_page: z.number(),
    total: z.number(),
  }),
});

export { oneTimeDonorsResponseSchema };
