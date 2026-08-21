import { z } from "zod";

const createFundraiserSchema = z.object({
  userEmail: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  percentageCommission: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : null)),
});

const cancelInviteFundraiserSchema = z.object({
  Id: z.string().min(1, "Id obrigatório"),
});

const resendInviteFundraiserSchema = z.object({
  Id: z.string().min(1, "Id obrigatório"),
});

const removeFundraiserSchema = z.object({
  Id: z.string().min(1, "Id obrigatório"),
});

export {
  cancelInviteFundraiserSchema,
  createFundraiserSchema,
  removeFundraiserSchema,
  resendInviteFundraiserSchema,
};
