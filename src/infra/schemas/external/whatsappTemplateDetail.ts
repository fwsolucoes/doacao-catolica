import { z } from "zod";

const whatsappTemplateDetailSchema = z.object({
  uuid: z.string(),
  template_name: z.string(),
  template_language: z.string().optional().nullable(),
  template_type: z.string(),
  notification_type: z.string(),
  template_preview_text: z.string().optional().nullable(),
  template_preview_image: z.string().optional().nullable(),
  header: z
    .object({
      type: z.string().optional().nullable(),
      text: z.string().optional().nullable(),
      link: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  variables: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string().optional().nullable(),
        table: z.string().optional().nullable(),
        field: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
      }),
    )
    .optional()
    .default([]),
  buttons: z
    .array(
      z.object({
        uuid: z.string(),
        sub_type: z.string(),
        value: z.string().optional().nullable(),
      }),
    )
    .optional()
    .default([]),
});

export { whatsappTemplateDetailSchema };
