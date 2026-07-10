import { z } from "zod";

const oneTimePaymentSchema = z
  .object({
    contactId: z.string().min(1),
    contactName: z.string().min(1),
    contactEmail: z.string().optional(),
    contactPhone: z.string().optional(),
    contactCpf: z.string().optional(),
    contactBirthDate: z.string().optional(),
    accountId: z.coerce.number(),
    category: z.enum(["donation", "tithe"]),
    paymentOption: z.enum(["onlinePayment", "receivedPayment"]),
    // online
    paymentType: z.enum(["pix", "bank_slip"]).optional(),
    amount: z.coerce.number().optional(),
    description: z.string().optional(),
    // offline
    paymentDate: z.string().optional(),
    method: z.string().optional(),
    bankAccount: z.string().optional(),
    observations: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentOption === "onlinePayment") {
      if (!data.paymentType) {
        ctx.addIssue({
          code: "custom",
          message: "Selecione a forma de pagamento",
          path: ["paymentType"],
        });
      }
      if (!data.amount || data.amount < 5) {
        ctx.addIssue({
          code: "custom",
          message: "Valor mínimo: R$ 5,00",
          path: ["amount"],
        });
      }
    }
    if (data.paymentOption === "receivedPayment") {
      if (!data.amount || data.amount <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Informe o valor recebido",
          path: ["amount"],
        });
      }
      if (!data.method) {
        ctx.addIssue({
          code: "custom",
          message: "Selecione a forma de pagamento",
          path: ["method"],
        });
      }
    }
  });

type CreateOneTimePaymentType = z.infer<typeof oneTimePaymentSchema>;

export { oneTimePaymentSchema, type CreateOneTimePaymentType };
