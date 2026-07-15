import { z } from "zod";

const createPaymentMethodBodySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

const updatePaymentMethodBodySchema = z.object({
  id: z.uuid({ message: "ID inválido" }),
  name: z.string().min(1, "Nome é obrigatório"),
});

const deletePaymentMethodBodySchema = z.object({
  id: z.uuid({ message: "ID inválido" }),
});

type CreatePaymentMethodBody = z.infer<typeof createPaymentMethodBodySchema>;
type UpdatePaymentMethodBody = z.infer<typeof updatePaymentMethodBodySchema>;
type DeletePaymentMethodBody = z.infer<typeof deletePaymentMethodBodySchema>;

export {
  createPaymentMethodBodySchema,
  updatePaymentMethodBodySchema,
  deletePaymentMethodBodySchema,
  type CreatePaymentMethodBody,
  type UpdatePaymentMethodBody,
  type DeletePaymentMethodBody,
};
