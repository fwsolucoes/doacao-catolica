import { z } from "zod";

const createNotificationSettingSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  days: z.coerce.number().int().min(0),
  whatsappMessage: z.string().default(""),
  mailSubject: z.string().default(""),
  mailMessage: z.string().default(""),
  emailImage1: z.string().default(""),
  enableWhatsapp: z.string().transform((v) => v === "true"),
  enableMail: z.string().transform((v) => v === "true"),
  enablePix: z.string().transform((v) => v === "true"),
  enableCreditCard: z.string().transform((v) => v === "true"),
  enableBankSlip: z.string().transform((v) => v === "true"),
});

type CreateNotificationSettingBody = z.infer<
  typeof createNotificationSettingSchema
>;

const updateNotificationSettingSchema = z.object({
  uuid: z.uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  days: z.coerce.number().int().min(0),
  whatsappMessage: z.string().default(""),
  mailSubject: z.string().default(""),
  mailMessage: z.string().default(""),
  emailImage1: z.string().default(""),
  enableWhatsapp: z.string().transform((v) => v === "true"),
  enableMail: z.string().transform((v) => v === "true"),
  enablePix: z.string().transform((v) => v === "true"),
  enableCreditCard: z.string().transform((v) => v === "true"),
  enableBankSlip: z.string().transform((v) => v === "true"),
});

type UpdateNotificationSettingBody = z.infer<
  typeof updateNotificationSettingSchema
>;

export { createNotificationSettingSchema, updateNotificationSettingSchema };
export type { CreateNotificationSettingBody, UpdateNotificationSettingBody };
