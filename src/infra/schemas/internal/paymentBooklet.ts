import { z } from "zod";

const generatePaymentBookletSchema = z.object({
  subscriptionUuid: z.string().uuid("UUID da assinatura inválido"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de término é obrigatória"),
});

type GeneratePaymentBookletType = z.infer<typeof generatePaymentBookletSchema>;

export { generatePaymentBookletSchema, type GeneratePaymentBookletType };
