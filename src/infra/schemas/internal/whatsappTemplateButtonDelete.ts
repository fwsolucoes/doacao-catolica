import { z } from "zod";

const deleteWhatsappTemplateButtonSchema = z.object({
  button_uuid: z.string(),
});

type DeleteWhatsappTemplateButtonBody = z.infer<typeof deleteWhatsappTemplateButtonSchema>;

export { deleteWhatsappTemplateButtonSchema };
export type { DeleteWhatsappTemplateButtonBody };
