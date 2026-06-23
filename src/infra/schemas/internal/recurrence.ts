import z from "zod";
type CreateRecurrenceType = z.infer<typeof createRecurrenceSchema>;

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

export { createRecurrenceSchema, type CreateRecurrenceType };
