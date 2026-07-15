import z from "zod";
type CreateRecurrenceType = z.infer<typeof createRecurrenceSchema>;
type DisableRecurrenceType = z.infer<typeof disableRecurrenceSchema>;
type UpdateRecurrenceType = z.infer<typeof updateRecurrenceSchema>;

const updateRecurrenceSchema = z.object({
  paymentId: z.string().min(1, "Payment ID é obrigatório"),
  payDay: z.coerce.number().int().min(1).max(31),
  type: z.enum(["pix", "bank_slip"]),
  valueType: z.enum(["fixed", "undetermined"]),
  amount: z.coerce.number().optional(),
  description: z.string().min(1, "A descrição é obrigatória"),
  discount: z.coerce.number().optional(),
  interest: z.coerce.number().optional(),
  fineType: z.enum(["percentage", "fixed"]).optional(),
  fineValue: z.coerce.number().optional(),
  perpetuatePaymentsChange: z
    .string()
    .optional()
    .transform((v) => v === "checked"),
  activeNotification: z
    .string()
    .optional()
    .transform((v) => (v === "checked" ? 1 : 0)),
});

const createRecurrenceSchema = z.object({
  contactId: z.string().min(1),
  contactName: z.string().min(1),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  contactCpf: z.string().optional(),
  contactBirthDate: z.string().optional(),
  accountId: z.coerce.number(),
  category: z.enum(["donation", "tithe"]),
  paymentDay: z.coerce
    .number()
    .int()
    .min(1, "Informe o dia do pagamento")
    .max(31),
  paymentType: z.enum(["pix", "bank_slip"]),
  valueType: z.enum(["fixed", "undetermined"]),
  amount: z.coerce.number().optional(),
  currentMonthPayment: z
    .string()
    .optional()
    .transform((v) => v === "sim"),
  activeNotification: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  description: z.string().optional(),
  discount: z.coerce.number().optional(),
  interest: z.coerce.number().optional(),
  fineType: z.enum(["fixed", "percentage"]).optional(),
  fineValue: z.coerce.number().optional(),
  missingFields: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

const disableRecurrenceSchema = z.object({
  subscriptionUuid: z.uuid({ message: "UUID inválido" }),
  observation: z.string().min(1, "A observação é obrigatória"),
  perpetuatePaymentsChange: z
    .string()
    .optional()
    .transform((v) => v === "checked"),
  perpetuateNextPaymentsChange: z
    .string()
    .optional()
    .transform((v) => v === "checked"),
});

const enableRecurrenceSchema = z.object({
  subscriptionUuid: z.uuid({ message: "UUID inválido" }),
  observation: z.string().optional(),
});

type EnableRecurrenceType = z.infer<typeof enableRecurrenceSchema>;

export {
  createRecurrenceSchema,
  type CreateRecurrenceType,
  disableRecurrenceSchema,
  type DisableRecurrenceType,
  enableRecurrenceSchema,
  type EnableRecurrenceType,
  updateRecurrenceSchema,
  type UpdateRecurrenceType,
};
