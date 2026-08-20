import { z } from "zod";

const externalPaymentCustomerSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  cpf_cnpj: z.string().nullable(),
  type: z.string(),
  phone: z.string().nullable(),
});

const externalPaymentItemSchema = z.object({
  payment_uuid: z.string(),
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
  customer: externalPaymentCustomerSchema.nullable(),
  notifications: z.array(
    z.object({
      channel: z.string(),
      notified: z.number(),
    }),
  ),
});

const externalPaymentsListSchema = z.object({
  current_page: z.number(),
  data: z.array(externalPaymentItemSchema),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

type ExternalPaymentItem = z.infer<typeof externalPaymentItemSchema>;

export { externalPaymentsListSchema, type ExternalPaymentItem };
