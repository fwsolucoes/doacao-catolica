import { z } from "zod";

const externalRegistrationWithoutDonationSchema = z.object({
  customer_id: z.number(),
  customer_uuid: z.string(),
  name: z.string(),
  cpf_cnpj: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  amount: z.number(),
  // known values: "pix" | "pix_automatico" | "cartao" | "boleto" | "manual"
  payment_method: z.string(),
  // known values: "Pix" | "Pix automático" | "Cartão" | "Boleto" | "Manual"
  payment_method_label: z.string(),
  // known values: "recurring" | "one_time"
  type: z.string(),
  // known values: "Recorrente" | "Pontual"
  type_label: z.string(),
  created_at: z.string(),
});

const externalRegistrationsWithoutDonationsSummarySchema = z.object({
  total_registrations: z.number(),
  recurring_count: z.number(),
  one_time_count: z.number(),
  monthly_potential_amount: z.number(),
  total_donors: z.number(),
  one_time_potential_amount: z.number(),
});

const externalRegistrationsWithoutDonationsPaginationSchema = z.object({
  total: z.number(),
  current_page: z.number(),
  last_page: z.number(),
  from: z.number().nullable(),
  to: z.number().nullable(),
});

const externalRegistrationsWithoutDonationsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    summary: externalRegistrationsWithoutDonationsSummarySchema,
    pagination: externalRegistrationsWithoutDonationsPaginationSchema,
    registrations: z.array(externalRegistrationWithoutDonationSchema),
  }),
});

type ExternalRegistrationWithoutDonation = z.infer<
  typeof externalRegistrationWithoutDonationSchema
>;

export {
  externalRegistrationsWithoutDonationsSchema,
  type ExternalRegistrationWithoutDonation,
};
