import { z } from "zod";

const updateWhatsappTemplateHeaderSchema = z.object({
  header_uuid: z.string(),
  header_type: z.string().default("none"),
  header_text: z.string().default(""),
  header_image: z.string().default(""),
  header_link: z.string().default(""),
  header_document: z.string().default(""),
});

type UpdateWhatsappTemplateHeaderBody = z.infer<typeof updateWhatsappTemplateHeaderSchema>;

export { updateWhatsappTemplateHeaderSchema };
export type { UpdateWhatsappTemplateHeaderBody };
