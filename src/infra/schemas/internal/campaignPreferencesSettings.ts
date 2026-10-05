import { z } from "zod";

const updateCampaignPreferencesSettingsSchema = z.object({
  redirectAfterRegistration: z
    .string()
    .optional()
    .transform((v) => v || null),
  redirectAfterOneTimePayment: z
    .string()
    .optional()
    .transform((v) => v || null),
  redirectAfterRecurringPayment: z
    .string()
    .optional()
    .transform((v) => v || null),
  nomenclature: z.string().transform((v) => v || null),
  supportTagId: z
    .string()
    .optional()
    .transform((v) => v || null),
  showAutoPixInvite: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  requireLogin: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  oneTimePaymentTitle: z
    .string()
    .optional()
    .transform((v) => v || null),
  monthlyPaymentTitle: z
    .string()
    .optional()
    .transform((v) => v || null),
  oneTimeThanksTitle: z
    .string()
    .optional()
    .transform((v) => v || null),
  oneTimeThanksDescription: z
    .string()
    .optional()
    .transform((v) => v || null),
  monthlyThanksTitle: z
    .string()
    .optional()
    .transform((v) => v || null),
  monthlyThanksDescription: z
    .string()
    .optional()
    .transform((v) => v || null),
  registrationThanksTitle: z
    .string()
    .optional()
    .transform((v) => v || null),
  registrationThanksDescription: z
    .string()
    .optional()
    .transform((v) => v || null),
});

type UpdateCampaignPreferencesSettingsSchema = z.infer<
  typeof updateCampaignPreferencesSettingsSchema
>;

export {
  updateCampaignPreferencesSettingsSchema,
  type UpdateCampaignPreferencesSettingsSchema,
};
