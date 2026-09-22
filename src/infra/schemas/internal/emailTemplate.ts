import { z } from "zod";

const createEmailTemplateSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
  body: z.string().min(1, "HTML é obrigatório"),
});

const updateEmailTemplateSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
  body: z.string().min(1, "HTML é obrigatório"),
});

const deleteEmailTemplateSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
});

type CreateEmailTemplateBody = z.infer<typeof createEmailTemplateSchema>;
type UpdateEmailTemplateBody = z.infer<typeof updateEmailTemplateSchema>;
type DeleteEmailTemplateBody = z.infer<typeof deleteEmailTemplateSchema>;

export {
  createEmailTemplateSchema,
  updateEmailTemplateSchema,
  deleteEmailTemplateSchema,
  type CreateEmailTemplateBody,
  type UpdateEmailTemplateBody,
  type DeleteEmailTemplateBody,
};
