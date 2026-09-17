import { z } from "zod";

const createTransferAccountBodySchema = z.object({
  pixType: z.string().min(1, "Tipo da chave Pix é obrigatório"),
  pixKey: z.string().min(1, "Chave Pix é obrigatória"),
  type: z.coerce.number(),
});

const requestWithdrawalBodySchema = z.object({
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  pixKey: z.string().min(1, "Chave Pix é obrigatória"),
  pixType: z.string().min(1, "Tipo da chave Pix é obrigatório"),
});

const bulkWithdrawalBodySchema = z.object({
  pixKey: z.string().min(1, "Chave Pix é obrigatória"),
  pixType: z.string().min(1, "Tipo da chave Pix é obrigatório"),
});

type CreateTransferAccountBody = z.infer<
  typeof createTransferAccountBodySchema
>;
type RequestWithdrawalBody = z.infer<typeof requestWithdrawalBodySchema>;
type BulkWithdrawalBody = z.infer<typeof bulkWithdrawalBodySchema>;

export {
  createTransferAccountBodySchema,
  requestWithdrawalBodySchema,
  bulkWithdrawalBodySchema,
  type CreateTransferAccountBody,
  type RequestWithdrawalBody,
  type BulkWithdrawalBody,
};
