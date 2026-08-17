import { z } from "zod";

const paymentNotificationItemSchema = z.object({
  uuid: z.string(),
  channel: z.string(),
  entity_name: z.string(),
  notification_type: z.string(),
  log_type: z.string(),
  request: z.string().nullable().optional(),
  response: z.string(),
  whatsapp_message_identification: z.string().nullable().optional(),
  whatsapp_number: z.string().nullable().optional(),
  email_message_identification: z.string().nullable().optional(),
  email_address: z.string().nullable().optional(),
  payment_due_date: z.string().nullable().optional(),
  customer: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
  }),
  created_at2: z.string(),
  updated_at2: z.string(),
  deleted_at2: z.string().nullable(),
});

const paymentNotificationsSchema = z.object({
  message: z.string().optional(),
  data: z.array(paymentNotificationItemSchema),
});

export { paymentNotificationsSchema };
