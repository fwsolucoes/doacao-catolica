import { z } from "zod";

const recurringDonorsResponseSchema = z.object({
  data: z.object({
    current_page: z.number(),
    data: z.array(
      z.object({
        subscription_uuid: z.string(),
        customer: z.object({
          uuid: z.string(),
          reference: z.string(),
          name: z.string(),
          cpf_cnpj: z.string().nullable(),
          email: z.string().nullable(),
          phone: z.string().nullable(),
        }),
        donations_last_12_months: z.number(),
        last_donation_at: z.string().nullable(),
        status: z.boolean(),
        active_notification: z.boolean(),
        affiliate_reference: z.string().nullable(),
        amount: z.number(),
        pay_day: z.number(),
        // known values: "automatic_pix" | "pix" | "bank_slip" | "credit_card"
        payment_method: z.string(),
        registered_at: z.string(),
      }),
    ),
    per_page: z.number(),
    total: z.number(),
  }),
});

export { recurringDonorsResponseSchema };
