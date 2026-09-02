import { z } from "zod";

const updateWhatsappTemplateButtonSchema = z.object({
  button: z
    .string()
    .transform((v) => JSON.parse(v))
    .pipe(
      z.object({
        uuid: z.string(),
        subType: z.string(),
        value: z.string().default(""),
      }),
    ),
});

type UpdateWhatsappTemplateButtonBody = z.infer<typeof updateWhatsappTemplateButtonSchema>;

export { updateWhatsappTemplateButtonSchema };
export type { UpdateWhatsappTemplateButtonBody };
