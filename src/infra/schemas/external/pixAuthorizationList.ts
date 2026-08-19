import { z } from "zod";

const externalPixAuthorizationItemSchema = z.object({
  authorization_uuid: z.string(),
  asaas_id: z.string(),
  // known values: "ACTIVE" | "CREATED" | "REFUSED" | "EXPIRED" | "CANCELLED"
  status: z.string(),
  status_label: z.string(),
  status_updated_at: z.string(),
  authorization_created_at: z.string().nullable(),
  expiration_date: z.string().nullable(),
  authorizations_count: z.number(),
  subscription: z.object({
    uuid: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    status: z.boolean(),
    amount: z.number(),
    pay_day: z.number(),
    registered_at: z.string(),
  }),
  customer: z.object({
    uuid: z.string(),
    reference: z.string(),
    name: z.string(),
    cpf_cnpj: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
  }),
  first_payment: z
    .object({
      uuid: z.string(),
      status: z.string(),
      amount: z.number(),
      due_date: z.string(),
    })
    .nullable(),
});

const externalPixAuthorizationListSchema = z.object({
  message: z.string().optional(),
  data: z.object({
    current_page: z.number(),
    data: z.array(externalPixAuthorizationItemSchema),
    per_page: z.number(),
    total: z.number(),
  }),
});

type ExternalPixAuthorizationList = z.infer<
  typeof externalPixAuthorizationListSchema
>;

export {
  externalPixAuthorizationListSchema,
  type ExternalPixAuthorizationList,
};
