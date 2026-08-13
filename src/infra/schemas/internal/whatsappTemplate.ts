import { z } from "zod";

const variableItemSchema = z.object({
  varType: z.enum(["dynamic", "fixed"]),
  systemField: z.string().default(""),
  fixedValue: z.string().default(""),
  description: z.string().default(""),
});

const buttonItemSchema = z
  .object({
    subType: z.string(),
    value: z.string().default(""),
  })
  .nullable();

const createWhatsappTemplateSchema = z.object({
  template_name: z.string().min(1, "Nome do template é obrigatório"),
  template_language: z.string().min(1, "Idioma é obrigatório"),
  template_type: z.enum(["utility", "marketing"]),
  notification_type: z.string().min(1, "Tipo de notificação é obrigatório"),
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

type CreateWhatsappTemplateBody = z.infer<typeof createWhatsappTemplateSchema>;

export { createWhatsappTemplateSchema };
export type { CreateWhatsappTemplateBody };
