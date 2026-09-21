import { z } from "zod";

const createSuggestedValueSchema = z.object({
  description: z.string().max(20, "Máximo de 20 caracteres").optional().transform((v) => v || ""),
  amount: z.string().min(1, "Campo obrigatório").transform((v) => parseFloat(v)),
});

const updateSuggestedValueSchema = z.object({
  id: z.uuid({ message: "ID inválido" }),
  description: z.string().max(20, "Máximo de 20 caracteres").optional().transform((v) => v || ""),
  amount: z.string().min(1, "Campo obrigatório").transform((v) => parseFloat(v)),
});

const deleteSuggestedValueSchema = z.object({
  id: z.uuid({ message: "ID inválido" }),
});

type CreateSuggestedValueBody = z.infer<typeof createSuggestedValueSchema>;
type UpdateSuggestedValueBody = z.infer<typeof updateSuggestedValueSchema>;
type DeleteSuggestedValueBody = z.infer<typeof deleteSuggestedValueSchema>;

export {
  createSuggestedValueSchema,
  updateSuggestedValueSchema,
  deleteSuggestedValueSchema,
  type CreateSuggestedValueBody,
  type UpdateSuggestedValueBody,
  type DeleteSuggestedValueBody,
};
