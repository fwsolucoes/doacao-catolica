import { z } from "zod";

const updateCampaignSeoSettingsSchema = z.object({
  metaTitle: z.string().transform((v) => v || null),
  metaDescription: z.string().transform((v) => v || null),
});

type UpdateCampaignSeoSettingsSchema = z.infer<
  typeof updateCampaignSeoSettingsSchema
>;

export {
  updateCampaignSeoSettingsSchema,
  type UpdateCampaignSeoSettingsSchema,
};
