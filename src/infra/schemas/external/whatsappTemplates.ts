import { z } from "zod";

const whatsappTemplateItemSchema = z.object({
  uuid: z.string(),
  template_name: z.string(),
  template_type: z.string(),
  notification_type: z.string(),
  template_preview_text: z.string().nullable(),
});

const listWhatsappTemplatesSchema = z.object({
  message: z.string().optional(),
  data: z.array(whatsappTemplateItemSchema).optional().default([]),
});

export { listWhatsappTemplatesSchema };
