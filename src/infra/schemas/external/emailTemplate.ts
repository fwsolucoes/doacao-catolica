import { z } from "zod";

const externalEmailTemplateSchema = z.object({
  uuid: z.string(),
  type: z.string(),
  body: z.string(),
  created_at2: z.string().nullable().optional(),
  updated_at2: z.string().nullable().optional(),
  deleted_at2: z.string().nullable().optional(),
});

const listEmailTemplatesSchema = z.object({
  message: z.string().optional(),
  data: z.array(externalEmailTemplateSchema).optional(),
});

export { listEmailTemplatesSchema };
