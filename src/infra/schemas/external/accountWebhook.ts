import { z } from "zod";

const externalAccountWebhookSchema = z.object({
  uuid: z.uuid(),
  url: z.string(),
  // known values: "*" (todos, inclusive futuros) | "payment.confirmed" | "payment.received"
  // | "payment.manual" | "subscription.created" | "subscription.inactivated"
  events: z
    .array(z.string())
    .nullish()
    .transform((v) => v ?? []),
  active: z.boolean(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

const externalAccountWebhooksSchema = z.object({
  data: z.array(externalAccountWebhookSchema),
});

type ExternalAccountWebhook = z.infer<typeof externalAccountWebhookSchema>;

export {
  externalAccountWebhookSchema,
  externalAccountWebhooksSchema,
  type ExternalAccountWebhook,
};
