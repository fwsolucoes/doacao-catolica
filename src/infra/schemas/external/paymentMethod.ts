import { z } from "zod";

type ExternalPaymentMethod = z.infer<typeof externalPaymentMethodSchema>;

const externalPaymentMethodSchema = z.object({
  uuid: z.uuid(),
  name: z.string(),
});

const externalPaymentMethodsSchema = z.object({
  data: z.array(externalPaymentMethodSchema),
});

export {
  externalPaymentMethodSchema,
  externalPaymentMethodsSchema,
  type ExternalPaymentMethod,
};
