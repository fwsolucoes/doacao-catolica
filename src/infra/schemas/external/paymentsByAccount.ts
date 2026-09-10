import { z } from "zod";

const externalPaymentsByAccountCustomerSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  cpf_cnpj: z.string().nullable(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  type: z.string().optional(),
});

const externalPaymentsByAccountItemSchema = z.object({
  payment_uuid: z.string(),
  account_name: z.string(),
  amount: z.number(),
  fee_amount: z.number(),
  payment_status: z.string(),
  payment_origin: z.string(),
  payment_type: z.string(),
  payment_due_date: z.string().nullable(),
  payment_paid_date: z.string().nullable(),
  payment_confirmed_date: z.string().nullable(),
  subscription_has_token: z.boolean(),
  // known values: "ACTIVE" | "REFUSED" | "CANCELLED" | "CREATED"
  pix_authorization_status: z.string().nullable(),
  operator_reference: z.string().nullable(),
  customer: externalPaymentsByAccountCustomerSchema.nullable(),
  notifications: z.array(
    z.object({
      channel: z.string(),
      notified: z.number(),
    }),
  ),
});

const externalPaymentsByAccountSchema = z.object({
  current_page: z.number(),
  data: z.array(externalPaymentsByAccountItemSchema),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

type ExternalPaymentsByAccountItem = z.infer<
  typeof externalPaymentsByAccountItemSchema
>;

export {
  externalPaymentsByAccountSchema,
  type ExternalPaymentsByAccountItem,
};
