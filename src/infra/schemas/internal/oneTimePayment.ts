import { z } from "zod";

const oneTimePaymentSchema = z
  .object({
    contactId: z.string().min(1),
    contactName: z.string().min(1),
    contactEmail: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    contactPhone: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    contactCpf: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    contactBirthDate: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    missingFields: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    accountId: z.coerce.number(),
    category: z.enum(["donation", "tithe"]),
    paymentOption: z.enum(["onlinePayment", "receivedPayment"]),
    amount: z.coerce.number().optional(),
    // online
    paymentType: z.enum(["pix", "bank_slip"]).optional(),
    // offline
    paymentDate: z
      .string()
      .optional()
      .transform((v) => v || new Date().toISOString().split("T")[0]),
    method: z.string().optional(),
    bankAccount: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    observations: z
      .string()
      .optional()
      .transform((v) => v || undefined),
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
