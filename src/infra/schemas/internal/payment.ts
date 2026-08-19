import { z } from "zod";

const cancelPaymentBodySchema = z.object({
  paymentId: z.uuid({ message: "ID inválido" }),
});

type CancelPaymentBody = z.infer<typeof cancelPaymentBodySchema>;

export { cancelPaymentBodySchema, type CancelPaymentBody };
