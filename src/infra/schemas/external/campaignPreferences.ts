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
  why_donate_enabled: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  about_us_enabled: z
    .boolean()
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
  pix_enable: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  bankslip_enable: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  credit_enable: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  min_amount: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  allow_transfer_taxes: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  show_custom_amount_option: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  generate_payment_immediately: z
    .boolean()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  email_sender_name: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  email_reply_to: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v ?? null),
});

type ExternalCampaignPreferences = z.infer<
  typeof externalCampaignPreferencesSchema
>;

export { externalCampaignPreferencesSchema, type ExternalCampaignPreferences };
