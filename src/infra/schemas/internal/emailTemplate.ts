import { z } from "zod";

const createEmailTemplateSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
  body: z.string().min(1, "HTML é obrigatório"),
});

type CreateEmailTemplateBody = z.infer<typeof createEmailTemplateSchema>;

export { createEmailTemplateSchema, type CreateEmailTemplateBody };
