import { z } from "zod";

const whatsappTemplateItemSchema = z.object({
  uuid: z.string(),
  template_name: z.string(),
  template_language: z.string().optional().nullable(),
  template_type: z.string(),
  notification_type: z.string(),
  template_preview_text: z.string().optional().nullable(),
  header: z
    .object({ type: z.string().optional().nullable() })
    .optional()
    .nullable(),
  variables: z.array(z.object({ uuid: z.string() })).optional().default([]),
  buttons: z.array(z.object({ uuid: z.string() })).optional().default([]),
});

const listWhatsappTemplatesSchema = z.object({
  message: z.string().optional(),
  data: z.array(whatsappTemplateItemSchema).optional().default([]),
});

export { listWhatsappTemplatesSchema };
