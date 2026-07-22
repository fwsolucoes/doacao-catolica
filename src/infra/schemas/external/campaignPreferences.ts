import { z } from "zod";

const externalCampaignPreferencesSchema = z.object({
  id: z.string(),
  // Fields below will be populated once the API supports them:
  registration_text: z.string(),
  registration_title: z.string(),
  why_donate_title: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  why_donate_text: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  why_donate_image: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  about_us_title: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  about_us_text: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  about_us_image: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  support_whatsapp: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  support_email: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
});

type ExternalCampaignPreferences = z.infer<
  typeof externalCampaignPreferencesSchema
>;

export { externalCampaignPreferencesSchema, type ExternalCampaignPreferences };
