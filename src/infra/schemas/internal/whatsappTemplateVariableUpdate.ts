import { z } from "zod";

const updateWhatsappTemplateVariableSchema = z.object({
  variable_uuid: z.string(),
  system_field: z.string().default(""),
  description: z.string().default(""),
});

type UpdateWhatsappTemplateVariableBody = z.infer<typeof updateWhatsappTemplateVariableSchema>;

export { updateWhatsappTemplateVariableSchema };
export type { UpdateWhatsappTemplateVariableBody };
