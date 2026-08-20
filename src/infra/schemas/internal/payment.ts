import { z } from "zod";

const cancelPaymentBodySchema = z.object({
  paymentId: z.uuid({ message: "ID inválido" }),
});

const manualPaymentBodySchema = z.object({
  paymentId: z.uuid({ message: "ID inválido" }),
  amount: z
    .string()
    .min(1, "Informe o valor recebido")
    .transform((v) => parseFloat(v))
    .refine((v) => v > 0, { message: "Informe um valor válido" }),
  paymentDate: z.string().min(1, "Informe a data de pagamento"),
  methodId: z.uuid({ message: "Selecione a forma de pagamento" }),
  bankAccount: z.string().optional(),
  observations: z.string().optional(),
});

const sendReminderNotificationBodySchema = z.object({
  paymentId: z.uuid({ message: "ID inválido" }),
});

type CancelPaymentBody = z.infer<typeof cancelPaymentBodySchema>;
type ManualPaymentBody = z.infer<typeof manualPaymentBodySchema>;
type SendReminderNotificationBody = z.infer<typeof sendReminderNotificationBodySchema>;

export {
  cancelPaymentBodySchema,
  manualPaymentBodySchema,
  sendReminderNotificationBodySchema,
  type CancelPaymentBody,
  type ManualPaymentBody,
  type SendReminderNotificationBody,
};
