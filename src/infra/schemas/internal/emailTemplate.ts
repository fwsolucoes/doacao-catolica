import { z } from "zod";

const createEmailTemplateSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
  body: z.string().min(1, "HTML é obrigatório"),
});

const deleteEmailTemplateSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
});

type CreateEmailTemplateBody = z.infer<typeof createEmailTemplateSchema>;
type DeleteEmailTemplateBody = z.infer<typeof deleteEmailTemplateSchema>;

export {
  createEmailTemplateSchema,
  deleteEmailTemplateSchema,
  type CreateEmailTemplateBody,
  type DeleteEmailTemplateBody,
};
