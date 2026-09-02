import { z } from "zod";

const createWhatsappTemplateVariableSchema = z.object({
  system_field: z.string().default(""),
  description: z.string().default(""),
});

type CreateWhatsappTemplateVariableBody = z.infer<typeof createWhatsappTemplateVariableSchema>;

export { createWhatsappTemplateVariableSchema };
export type { CreateWhatsappTemplateVariableBody };
