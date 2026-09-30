import { z } from "zod";

const updateCampaignIntegrationsSettingsSchema = z.object({
  googleAnalyticsPixel: z.string().optional().transform((v) => v || null),
  googleTagManagerPixel: z.string().optional().transform((v) => v || null),
  facebookPixel: z.string().optional().transform((v) => v || null),
  facebookEnable: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  googleAnalyticsEnable: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

type UpdateCampaignIntegrationsSettingsSchema = z.infer<
  typeof updateCampaignIntegrationsSettingsSchema
>;

export {
  updateCampaignIntegrationsSettingsSchema,
  type UpdateCampaignIntegrationsSettingsSchema,
};
