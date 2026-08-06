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
  showAutoPixInvite: z.string().transform((v) => v === "true"),
  requireLogin: z.string().transform((v) => v === "true"),
});

type UpdateCampaignPreferencesSettingsSchema = z.infer<
  typeof updateCampaignPreferencesSettingsSchema
>;

export {
  updateCampaignPreferencesSettingsSchema,
  type UpdateCampaignPreferencesSettingsSchema,
};
