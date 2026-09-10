import { z } from "zod";

const paymentStatusItemSchema = z.object({
  amount: z.number(),
  fee_amount: z.number(),
  quantity: z.number(),
  gross_amount: z.number().optional(),
});

const paymentsByStatusSchema = z.object({
  overdue: paymentStatusItemSchema,
  awaiting_payment: paymentStatusItemSchema,
  canceled: paymentStatusItemSchema,
  confirmed: paymentStatusItemSchema,
  created: paymentStatusItemSchema,
  deleted: paymentStatusItemSchema,
  failed: paymentStatusItemSchema,
  manual: paymentStatusItemSchema,
  processing: paymentStatusItemSchema,
  received: paymentStatusItemSchema,
  refunded: paymentStatusItemSchema,
});

const externalTotalPaymentsByAccountSchema = z.object({
  message: z.string().optional(),
  data: z.object({
    total: z.object({
      amount: z.number(),
      fee_amount: z.number(),
      quantity: z.number(),
    }),
    total_by_status: paymentsByStatusSchema,
    details: z.object({
      transfers: paymentsByStatusSchema,
      subscriptions: paymentsByStatusSchema,
    }),
  }),
});

type ExternalTotalPaymentsByAccount = z.infer<
  typeof externalTotalPaymentsByAccountSchema
>;

export {
  externalTotalPaymentsByAccountSchema,
  type ExternalTotalPaymentsByAccount,
};
