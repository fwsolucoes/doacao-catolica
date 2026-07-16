import { z } from "zod";

const createTransferAccountBodySchema = z.object({
  pixType: z.string().min(1, "Tipo da chave Pix é obrigatório"),
  pixKey: z.string().min(1, "Chave Pix é obrigatória"),
  type: z.coerce.number(),
});

const requestWithdrawalBodySchema = z.object({
  account_uuid: z.string().uuid("Conta inválida"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  pix_key: z.string().min(1, "Chave Pix é obrigatória"),
  pix_type: z.string().min(1, "Tipo da chave Pix é obrigatório"),
  schedule_date: z.string().min(1, "Data de agendamento é obrigatória"),
});

type CreateTransferAccountBody = z.infer<
  typeof createTransferAccountBodySchema
>;
type RequestWithdrawalBody = z.infer<typeof requestWithdrawalBodySchema>;

export {
  createTransferAccountBodySchema,
  requestWithdrawalBodySchema,
  type CreateTransferAccountBody,
  type RequestWithdrawalBody,
};
