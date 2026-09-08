import { z } from "zod";

const externalAccountWhatsappSettingsSchema = z.object({
  data: z
    .object({
      // known values: "platform" | "custom"
      type: z.string().nullable().optional(),
      // known values: "aini" | "unofficial_whaticket" | "official_whaticket"
      provider: z.string().nullable().optional(),
      has_token: z.boolean(),
      active: z.boolean(),
    })
    .nullable()
    .optional(),
});

type ExternalAccountWhatsappSettings = z.infer<
  typeof externalAccountWhatsappSettingsSchema
>;

export { externalAccountWhatsappSettingsSchema };
export type { ExternalAccountWhatsappSettings };
