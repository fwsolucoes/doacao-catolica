import { z } from "zod";

const createWhatsappTemplateButtonSchema = z.object({
  button: z
    .string()
    .transform((v) => JSON.parse(v))
    .pipe(
      z.object({
        subType: z.string(),
        value: z.string().default(""),
      }),
    ),
});

type CreateWhatsappTemplateButtonBody = z.infer<typeof createWhatsappTemplateButtonSchema>;

export { createWhatsappTemplateButtonSchema };
export type { CreateWhatsappTemplateButtonBody };
