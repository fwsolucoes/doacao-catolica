import { z } from "zod";

const deleteWhatsappTemplateVariableSchema = z.object({
  variable_uuid: z.string(),
});

type DeleteWhatsappTemplateVariableBody = z.infer<typeof deleteWhatsappTemplateVariableSchema>;

export { deleteWhatsappTemplateVariableSchema };
export type { DeleteWhatsappTemplateVariableBody };
