import { z } from "zod";

const updateCampaignEmailSettingsSchema = z.object({
  emailSenderName: z.string().transform((v) => v || null),
  emailReplyTo: z
    .string()
    .optional()
    .transform((v) => v || null),
});

type UpdateCampaignEmailSettingsSchema = z.infer<
  typeof updateCampaignEmailSettingsSchema
>;

export {
  updateCampaignEmailSettingsSchema,
  type UpdateCampaignEmailSettingsSchema,
};
