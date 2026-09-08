import { z } from "zod";

const testWhatsappConnectionSchema = z.object({
  token: z.string().min(1),
});

const updateAccountWhatsappSettingsSchema = z.object({
  accountReference: z.string().min(1),
  provider: z.enum(["aini", "unofficial_whaticket"]),
  type: z.literal("custom"),
});

const createDefaultAccountWhatsappSettingsSchema = z.object({
  accountReference: z.string().min(1),
});

export {
  testWhatsappConnectionSchema,
  updateAccountWhatsappSettingsSchema,
  createDefaultAccountWhatsappSettingsSchema,
};
