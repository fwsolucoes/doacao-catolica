import { z } from "zod";

const externalPixAuthorizationHistorySchema = z.object({
  message: z.string().optional(),
  data: z.object({
    subscription: z.object({
      uuid: z.string(),
      name: z.string(),
      description: z.string(),
      type: z.string(),
      status: z.boolean(),
      amount: z.number(),
      pay_day: z.number(),
    }),
    customer: z.object({
      uuid: z.string(),
      name: z.string(),
      cpf_cnpj: z.string().nullable(),
      email: z.string().nullable(),
    }),
    authorizations: z.array(
      z.object({
        authorization_uuid: z.string(),
        asaas_id: z.string(),
        // known values: "ACTIVE" | "CREATED" | "REFUSED" | "EXPIRED" | "CANCELLED"
        status: z.string(),
        status_label: z.string(),
        status_updated_at: z.string(),
        authorization_created_at: z.string().nullable(),
        expiration_date: z.string().nullable(),
        previous_type: z.string().nullable(),
        conciliation_identifier: z.string().nullable(),
        first_payment: z
          .object({
            uuid: z.string(),
            status: z.string(),
            amount: z.number(),
            due_date: z.string(),
          })
          .nullable(),
      }),
    ),
  }),
});

type ExternalPixAuthorizationHistory = z.infer<
  typeof externalPixAuthorizationHistorySchema
>;

export {
  externalPixAuthorizationHistorySchema,
  type ExternalPixAuthorizationHistory,
};
