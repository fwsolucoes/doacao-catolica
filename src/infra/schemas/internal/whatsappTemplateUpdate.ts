import { z } from "zod";

const variableItemSchema = z.object({
  systemField: z.string().default(""),
  description: z.string().default(""),
});

const buttonItemSchema = z
  .object({
    subType: z.string(),
    value: z.string().default(""),
  })
  .nullable();

const updateWhatsappTemplateSchema = z.object({
  _action: z.string(),
  template_name: z.string().default(""),
  template_language: z.string().default(""),
  template_type: z.string().default(""),
  notification_type: z.string().default(""),
  template_preview_text: z.string().default(""),
  template_preview_image: z.string().default(""),
  header_type: z.string().default("none"),
  header_text: z.string().default(""),
  header_image: z.string().default(""),
  header_link: z.string().default(""),
  header_document: z.string().default(""),
  variables: z
    .string()
    .default("[]")
    .transform((v) => JSON.parse(v))
    .pipe(z.array(variableItemSchema).default([])),
  button: z
    .string()
    .default("null")
    .transform((v) => JSON.parse(v))
    .pipe(buttonItemSchema.default(null)),
});

type UpdateWhatsappTemplateBody = z.infer<typeof updateWhatsappTemplateSchema>;

export { updateWhatsappTemplateSchema };
export type { UpdateWhatsappTemplateBody };
