import { z } from "zod";

const notificationSettingsSchema = z.object({
  message: z.string().optional(),
  data: z.array(
    z.object({
      uuid: z.string(),
      active: z.number(),
      // known values: "payment_before_due_date" | "payment_on_due_date" | "payment_after_due_date" | "payment_paid" | "payment_settled" | "credit_card_failure" | "credit_card_created" | "subscription_created_internally" | "subscription_created_externally" | "default_recovery" | "subscription_canceled" | "donator_birthday" | "manual" | "transfer_unpaid" | "instant_reminder" | "donate_now" | "pending_automatic_pix_authorization" | "inactive_donor"
      type: z.string(),
      name: z.string(),
      days: z.number(),
      whatsapp_message: z.string().nullable(),
      mail_subject: z.string(),
      mail_message: z.string(),
      enable_whatsapp: z.number(),
      enable_mail: z.number(),
      enable_pix: z.number(),
      enable_credit_card: z.number(),
      enable_bank_slip: z.number(),
      banner_image: z.string().nullable(),
      webhook_url: z.string().nullable(),
      keyword_flow: z.string().nullable(),
      whatsapp_type: z.string().nullable(),
      created_at2: z.string(),
      updated_at2: z.string(),
      deleted_at2: z.string().nullable(),
    }),
  ),
});

export { notificationSettingsSchema };
