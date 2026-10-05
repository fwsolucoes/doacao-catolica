import z from "zod";

const updateCampaignPaymentSettingsSchema = z.object({
  pixEnabled: z.string().optional().transform((v) => v === "true"),
  boletoEnabled: z.string().optional().transform((v) => v === "true"),
  creditCardEnabled: z.string().optional().transform((v) => v === "true"),
  minAmount: z.string().optional().transform((v) => (v ? parseFloat(v) : null)),
  passFeeToDonor: z.string().optional().transform((v) => v === "true"),
  allowCustomAmount: z.string().optional().transform((v) => v === "true"),
  chargeImmediately: z.string().optional().transform((v) => v === "true"),
});

type UpdateCampaignPaymentSettingsType = z.infer<
  typeof updateCampaignPaymentSettingsSchema
>;

export {
  updateCampaignPaymentSettingsSchema,
  type UpdateCampaignPaymentSettingsType,
};
